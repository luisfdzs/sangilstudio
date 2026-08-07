#!/usr/bin/env node

import process from 'node:process'
import { chromium } from 'playwright-core'

const BASE = process.env.BASE ?? 'http://localhost:3000'
const LOCALE = process.env.LOCALE ?? 'es'

const CHROME =
  process.env.CHROME_PATH ??
  (process.platform === 'win32'
    ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
    : process.platform === 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : '/usr/bin/google-chrome')

const results = []
const check = (ok, label) => {
  results.push({ ok, label })
  console.log(`${ok ? '  ✓' : '  ✗'} ${label}`)
}

async function horizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
}

async function main() {
  const browser = await chromium.launch({ executablePath: CHROME })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()

  const errors = []
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', (error) => errors.push(String(error)))

  console.log(`\nRevisión móvil (390×844) sobre ${BASE}/${LOCALE}\n`)

  await page.goto(`${BASE}/${LOCALE}`, { waitUntil: 'networkidle' })
  check((await horizontalOverflow(page)) <= 1, 'la portada no desborda en horizontal')

  check(
    !(await page.locator('header nav').count()),
    'la barra no lleva navegación propia: sólo marca y botón',
  )

  check(
    (await page.locator('main > *').count()) === 2,
    `la portada tiene dos bloques (${await page.locator('main > *').count()})`,
  )
  check(!(await page.locator('footer').count()), 'no hay pie de página')

  const hero = page.locator('[data-hero]')
  const heroBox = await hero.boundingBox()
  const barBottom = await page.evaluate(
    () => document.querySelector('header')?.getBoundingClientRect().bottom ?? 0,
  )
  check(
    (heroBox?.y ?? 0) >= barBottom - 1,
    `el hero arranca por debajo de la cabecera (${Math.round(heroBox?.y ?? 0)} px, barra hasta ${Math.round(barBottom)})`,
  )
  check(
    (heroBox?.x ?? 0) >= 16 && (heroBox?.width ?? 390) <= 390 - 32,
    `el hero tiene márgenes laterales (${Math.round(heroBox?.x ?? 0)} px a cada lado)`,
  )
  check(
    (heroBox?.height ?? 0) > 844 * 0.7,
    `el hero llena la ventana bajo la cabecera (${Math.round(heroBox?.height ?? 0)} px)`,
  )
  const heroHref = await hero.locator('a[href]').first().getAttribute('href')
  check(heroHref?.endsWith('/work') === true, `el hero lleva a proyectos (${heroHref})`)

  const heroArrows = await hero.locator('button:visible').count()
  check(heroArrows === 0, `el hero no muestra flechas en móvil (${heroArrows})`)

  const toggle = page.locator('header button[aria-controls="site-menu"]')
  check(await toggle.isVisible(), 'el botón «+» se ve en la esquina superior derecha')

  const toggleBox = await toggle.boundingBox()
  check(
    (toggleBox?.x ?? 0) + (toggleBox?.width ?? 0) > 390 - 40,
    `el «+» está pegado al borde derecho (${Math.round((toggleBox?.x ?? 0) + (toggleBox?.width ?? 0))} px)`,
  )

  const closed = await page.evaluate(() => {
    const style = getComputedStyle(document.getElementById('site-menu'))
    return {
      visibility: style.visibility,
      opacity: style.opacity,
      transition: style.transitionProperty,
      inert: document.getElementById('site-menu').hasAttribute('inert'),
    }
  })
  check(
    closed.visibility === 'hidden' && closed.opacity === '0' && closed.inert,
    `el menú cerrado está apagado (${closed.visibility}, opacidad ${closed.opacity}, inert ${closed.inert})`,
  )
  check(
    closed.transition.includes('opacity'),
    `el menú aparece con fundido (transición: ${closed.transition})`,
  )

  await toggle.click()
  const panel = page.locator('#site-menu')
  const opened = await panel
    .waitFor({ state: 'visible', timeout: 4000 })
    .then(() => true)
    .catch(() => false)
  check(opened, 'el menú se abre')

  const panelBox = await panel.boundingBox()
  check(
    Math.abs((panelBox?.height ?? 0) - 844) <= 2 && Math.abs((panelBox?.width ?? 0) - 390) <= 2,
    `el menú ocupa toda la pantalla (${Math.round(panelBox?.width ?? 0)}×${Math.round(panelBox?.height ?? 0)})`,
  )

  const legible = await page.evaluate(() => {
    const link = document.querySelector('#site-menu a')
    if (!link) return false
    const luminance = (color) => {
      const [r, g, b] = color.match(/\d+(\.\d+)?/g).map(Number)
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    }
    const panelBackground = getComputedStyle(document.getElementById('site-menu')).backgroundColor
    return Math.abs(luminance(getComputedStyle(link).color) - luminance(panelBackground)) > 0.4
  })
  check(legible, 'el texto del menú contrasta con su fondo')

  const offCentre = await page.evaluate(() => {
    const middle = window.innerWidth / 2
    return Math.max(
      ...[...document.querySelectorAll('#site-menu nav > a')].map((link) => {
        const box = link.getBoundingClientRect()
        return Math.abs((box.left + box.right) / 2 - middle)
      }),
    )
  })
  check(offCentre <= 2, `el menú está centrado (${Math.round(offCentre)} px de desvío)`)

  check(
    await toggle.isVisible(),
    'el botón sigue accesible con el menú abierto (se convierte en «−»)',
  )
  const closes = async (label) => {
    const hidden = await panel
      .waitFor({ state: 'hidden', timeout: 4000 })
      .then(() => true)
      .catch(() => false)
    check(hidden, label)
  }

  await toggle.click()
  await closes('el «−» cierra el menú')

  await toggle.click()
  await panel.waitFor({ state: 'visible', timeout: 4000 })
  await page.keyboard.press('Escape')
  await closes('Escape cierra el menú')

  const tightHeader = await page.evaluate(() =>
    [...document.querySelectorAll('header a, header button')]
      .filter((element) => element.getBoundingClientRect().height > 2)
      .map((element) => {
        const before = getComputedStyle(element, '::before')
        const grow =
          before.content !== 'none' && before.position === 'absolute'
            ? Math.abs(Number.parseFloat(before.top) || 0) * 2
            : 0
        return {
          text: element.textContent.trim().slice(0, 30),
          height: element.getBoundingClientRect().height + grow,
        }
      })
      .filter((element) => element.height < 24),
  )
  check(
    tightHeader.length === 0,
    tightHeader.length === 0
      ? 'los controles de la cabecera llegan a 24 px'
      : `por debajo de 24 px: ${JSON.stringify(tightHeader)}`,
  )

  await page.goto(`${BASE}/${LOCALE}/contact`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  const contactTop = await page.evaluate(() => {
    const section = document.getElementById('contact')
    return section ? Math.round(section.getBoundingClientRect().top) : null
  })
  const headerBottom = await page.evaluate(
    () => document.querySelector('header')?.getBoundingClientRect().bottom ?? 0,
  )
  check(contactTop !== null, `/${LOCALE}/contact devuelve la portada con la sección`)
  check(
    contactTop !== null && contactTop >= headerBottom && contactTop < 200,
    `contacto queda bajo la cabecera (${contactTop} px)`,
  )
  check((await horizontalOverflow(page)) <= 1, '/contact no desborda en horizontal')
  check(!(await page.evaluate(() => location.hash)), '/contact no deja almohadilla en la URL')

  const contactLinks = page.locator('#contact ul a')
  check(
    (await contactLinks.count()) >= 2,
    `el contacto tiene sus enlaces (${await contactLinks.count()})`,
  )

  await page.goto(`${BASE}/${LOCALE}/studio`, { waitUntil: 'networkidle' })
  check(
    (await page.locator('h1').first().isVisible()) && !(await page.locator('[data-hero]').count()),
    '/studio es una página propia, no la portada',
  )
  check((await horizontalOverflow(page)) <= 1, '/studio no desborda en horizontal')

  check(!(await page.locator('main section').count()), '/studio no lleva equipo ni colaboradores')

  await page.goto(`${BASE}/${LOCALE}/work`, { waitUntil: 'networkidle' })
  check((await horizontalOverflow(page)) <= 1, '/work no desborda en horizontal')

  const h1 = await page.evaluate(() => {
    const nodes = document.querySelectorAll('main h1')
    if (nodes.length !== 1) return { count: nodes.length, width: -1 }
    const box = nodes[0].getBoundingClientRect()
    return { count: 1, width: Math.max(box.width, box.height) }
  })
  check(
    h1.count === 1 && h1.width <= 2,
    `el título de /work está en el HTML pero no a la vista (${h1.count} h1, ${h1.width} px)`,
  )

  const cards = page.locator('main article')
  const total = await cards.count()
  check(total > 0, `hay proyectos en la rejilla (${total})`)

  const columns = await page.evaluate(
    () =>
      new Set(
        [...document.querySelectorAll('main article')].map((card) =>
          Math.round(card.getBoundingClientRect().x),
        ),
      ).size,
  )
  check(columns === 1, `una sola columna en móvil (${columns})`)

  const squares = await page.evaluate(() => {
    const boxes = [...document.querySelectorAll('main article img')].map((img) =>
      img.getBoundingClientRect(),
    )
    return boxes.every((box) => Math.abs(box.width - box.height) <= 2)
  })
  check(squares, 'las imágenes de la rejilla son cuadradas')

  const search = page.locator('#project-search')
  check(await search.isVisible(), 'el buscador se ve')

  const centred = await page.evaluate(() => {
    const box = document.getElementById('project-search').getBoundingClientRect()
    return Math.abs(box.left - (window.innerWidth - box.right))
  })
  check(centred <= 2, `el buscador está centrado (${Math.round(centred)} px de diferencia)`)
  await search.fill('zzzzzz')
  await page.waitForTimeout(200)
  check((await cards.count()) === 0, 'una búsqueda sin resultados vacía la rejilla')
  await search.fill('')
  await page.waitForTimeout(200)
  check((await cards.count()) === total, 'al vaciar el buscador vuelven todos')

  const options = page.locator('#project-search-listbox [role="option"]')
  await search.click()
  await page.waitForTimeout(200)
  check((await options.count()) === total, `el desplegable lista los títulos (${total})`)
  check((await horizontalOverflow(page)) <= 1, 'el desplegable no desborda en horizontal')

  await search.fill('hous')
  await page.waitForTimeout(200)
  const narrowed = await options.count()
  check(
    narrowed > 0 && narrowed < total,
    `el desplegable se reduce al escribir (${narrowed} de ${total})`,
  )
  check(narrowed === (await cards.count()), 'el desplegable y la rejilla muestran lo mismo')

  const firstOption = await options.first().textContent()
  await options.first().click()
  await page.waitForURL(/\/work\/.+/, { timeout: 5000 })
  check(/\/work\/.+/.test(page.url()), `elegir un título abre su ficha (${firstOption?.trim()})`)

  await page.goto(`${BASE}/${LOCALE}/work`, { waitUntil: 'networkidle' })

  const deep = await page.evaluate(
    () => document.querySelector('main a[href*="/work/"]')?.getAttribute('href') ?? null,
  )
  check(Boolean(deep), `hay fichas de proyecto enlazadas desde /work (${deep ?? 'ninguna'})`)
  if (deep) {
    await page.goto(`${BASE}${deep}`, { waitUntil: 'networkidle' })
    const relatives = await page.evaluate(() =>
      [...document.querySelectorAll('header a')]
        .map((a) => a.getAttribute('href') ?? '')
        .filter((href) => href && !/^(\/|#|https?:|mailto:|tel:)/.test(href)),
    )
    check(
      relatives.length === 0,
      relatives.length === 0
        ? 'los enlaces de la cabecera son absolutos'
        : `enlaces relativos (encadenarán y darán 404): ${relatives.join(', ')}`,
    )

    const galleryColumns = await page.evaluate(
      () =>
        new Set(
          [...document.querySelectorAll('article img')].map((img) =>
            Math.round(img.getBoundingClientRect().x),
          ),
        ).size,
    )
    check(galleryColumns === 1, `las imágenes de la ficha van a una columna (${galleryColumns})`)
    check((await horizontalOverflow(page)) <= 1, 'la ficha no desborda en horizontal')
  }

  if (!BASE.includes('sangilstudio.com')) {
    const robotsMeta = await page.evaluate(
      () => document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '(ninguna)',
    )
    check(
      robotsMeta.includes('noindex'),
      `este entorno no es indexable (meta robots: ${robotsMeta})`,
    )
  }

  check(errors.length === 0, `sin errores de consola${errors.length ? `: ${errors[0]}` : ''}`)

  await browser.close()

  const failed = results.filter((result) => !result.ok)
  console.log(
    `\n${results.length - failed.length}/${results.length} comprobaciones correctas` +
      (failed.length ? ` — ${failed.length} fallo(s)\n` : '\n'),
  )
  process.exit(failed.length ? 1 : 0)
}

await main()
