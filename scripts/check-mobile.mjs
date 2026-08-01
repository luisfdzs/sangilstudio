#!/usr/bin/env node
/**
 * VERIFICACIÓN EN MÓVIL · `npm run check:mobile`
 *
 * Abre el sitio en un Chrome real a 390×844 (tamaño de iPhone) y comprueba lo que
 * en escritorio no se ve. No es un test unitario: es la lista de cosas que ya se
 * han roto alguna vez en este proyecto.
 *
 * Historial de fallos que este script encontró (y que en escritorio eran invisibles):
 *  1. El menú se abría con el texto en color papel sobre fondo papel — ilegible.
 *  2. El panel del menú medía 0 px de alto: el `backdrop-blur` de la barra convierte
 *     al <header> en bloque contenedor de sus descendientes `fixed`.
 *  3. Enlaces con menos de 24 px de área pulsable (WCAG 2.2).
 *
 * Los dos primeros eran del menú desplegable de la cabecera, que ya no existe: la
 * navegación de móvil es ahora una barra fija de iconos abajo. Se quedan escritos porque
 * explican por qué esta lista mide lo que mide.
 *
 * Usa `playwright-core` con el Chrome ya instalado: no descarga navegadores.
 * Requiere el servidor levantado (`npm run dev`) o un despliegue:
 *
 *   npm run check:mobile                       → http://localhost:3000
 *   BASE=https://sangilstudiotest.vercel.app npm run check:mobile
 */

import process from 'node:process'
import { chromium } from 'playwright-core'

const BASE = process.env.BASE ?? 'http://localhost:3000'
const LOCALE = process.env.LOCALE ?? 'es'

/** Chrome instalado en el sistema. Se puede sobreescribir con CHROME_PATH. */
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

/** Ningún sitio debe desbordar horizontalmente en móvil. */
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

  // --- Portada ---------------------------------------------------------------
  await page.goto(`${BASE}/${LOCALE}`, { waitUntil: 'networkidle' })
  check((await horizontalOverflow(page)) <= 1, 'la portada no desborda en horizontal')

  check(
    !(await page.locator('header nav[aria-label="Principal"]').first().isVisible()),
    'la navegación de escritorio está oculta',
  )

  // --- La barra inferior de iconos --------------------------------------------
  // Sustituyó al botón «Menú» de la cabecera. Lo que se comprueba aquí es lo que la
  // hace útil: que esté a la vista SIEMPRE —también tras bajar hasta el pie—, que no
  // tape nada y que el pulgar la alcance.
  const bar = page.locator('nav[aria-label="Navegación"]')
  check(await bar.isVisible(), 'la barra de iconos se ve en móvil')

  const slots = bar.locator('a, button')
  check((await slots.count()) === 5, `la barra tiene cinco huecos (${await slots.count()})`)

  // Todos los huecos, con el dedo: WCAG 2.2 pide 24×24 px como mínimo.
  const tightSlots = []
  for (let index = 0; index < (await slots.count()); index += 1) {
    const box = await slots.nth(index).boundingBox()
    if (!box || box.width < 24 || box.height < 24) tightSlots.push(index)
  }
  check(
    tightSlots.length === 0,
    `todos los huecos pasan de 24 px (fallan: ${tightSlots.join(', ') || '—'})`,
  )

  // Fija de verdad: se baja hasta el final y la barra sigue en el borde inferior.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(600)
  const barBox = await bar.boundingBox()
  const viewport = page.viewportSize()
  check(
    Math.abs((barBox?.y ?? 0) + (barBox?.height ?? 0) - viewport.height) <= 1,
    'la barra sigue pegada abajo tras bajar hasta el pie',
  )

  // El <body> se reserva el alto de la barra: si no, el copyright queda debajo.
  const footerHidden = await page.evaluate(() => {
    const last = document.querySelector('footer p:last-of-type')
    if (!last) return null
    const bottom = last.getBoundingClientRect().bottom
    const nav = document.querySelector('nav[aria-label="Navegación"]')
    return bottom > nav.getBoundingClientRect().top
  })
  check(footerHidden === false, 'el pie no queda tapado por la barra')

  // --- El selector de idioma: abrir, cerrar, y que no tape la barra ------------
  const localeButton = bar.locator('button[aria-controls="mobile-locales"]')
  await localeButton.click()
  const tray = page.locator('#mobile-locales')
  const opened = await tray
    .waitFor({ state: 'visible', timeout: 4000 })
    .then(() => true)
    .catch(() => false)
  check(opened, 'la bandeja de idiomas se abre')

  // La bandeja se apoya JUSTO encima de la barra: si el cálculo del alto fallara,
  // se solaparían y el botón de cerrar dejaría de ser pulsable.
  const trayBox = await tray.boundingBox()
  const barTop = (await bar.boundingBox())?.y ?? 0
  check(
    Math.abs((trayBox?.y ?? 0) + (trayBox?.height ?? 0) - barTop) <= 1,
    'la bandeja se apoya justo encima de la barra',
  )

  await page.keyboard.press('Escape')
  check(!(await tray.isVisible()), 'Escape cierra la bandeja de idiomas')

  // --- El wordmark, centrado en la cabecera de móvil --------------------------
  // Sin menú al lado, la marca se centra. Se mide contra el centro de la pantalla.
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(400)
  const markOffset = await page.evaluate(() => {
    const mark = document.querySelector('.header-bar a[aria-label] svg')
    if (!mark) return null
    const box = mark.getBoundingClientRect()
    return Math.abs(box.left + box.width / 2 - window.innerWidth / 2)
  })
  check(markOffset !== null && markOffset < 4, `el wordmark va centrado (${markOffset} px del eje)`)

  // --- Resto de plantillas ---------------------------------------------------
  await page.goto(`${BASE}/${LOCALE}/work`, { waitUntil: 'networkidle' })
  check((await horizontalOverflow(page)) <= 1, '/work no desborda en horizontal')

  // Estudio y contacto son secciones de la portada, pero con RUTA propia (`/es/studio`,
  // no `/es#studio`). Se entra por esa URL y se comprueba que devuelve la portada con la
  // sección colocada bajo la barra fija, no tapada por ella. Es el contrato de la ruta:
  // si el salto se hiciera antes de que la página asiente, el encabezado quedaría oculto
  // —pasó con las fuentes, ver `ScrollToSection`— y esto lo cazaría.
  for (const id of ['studio', 'contact']) {
    await page.goto(`${BASE}/${LOCALE}/${id}`, { waitUntil: 'networkidle' })
    // Se mide con la página ya asentada: las imágenes de la rejilla entran perezosamente
    // y las fuentes cambian los altos, así que midiendo antes la sección aún se mueve.
    await page.waitForTimeout(1500)
    const top = await page.evaluate((anchor) => {
      const section = document.getElementById(anchor)
      return section ? Math.round(section.getBoundingClientRect().top) : null
    }, id)
    const barBottom = await page.evaluate(
      () => document.querySelector('header')?.getBoundingClientRect().bottom ?? 0,
    )
    check(top !== null, `/${LOCALE}/${id} devuelve la portada con la sección ${id}`)
    check(top !== null && top >= barBottom && top < 200, `${id} queda bajo la barra (${top} px)`)
    check((await horizontalOverflow(page)) <= 1, `/${LOCALE}/${id} no desborda en horizontal`)
    // La mejora es la URL: nada de almohadilla en la barra de direcciones.
    check(
      !(await page.evaluate(() => location.hash)),
      `/${LOCALE}/${id} no deja almohadilla en la URL`,
    )
  }

  // --- Enlaces absolutos, comprobado desde una página PROFUNDA -----------------
  // `href()` devolvía rutas relativas (`es/work`): desde la portada funcionaban por
  // casualidad y desde una ficha encadenaban → /es/work/es/work → 404. Se comprueba
  // desde el nivel más profundo del sitio, que es donde se notaba.
  await page.goto(`${BASE}/${LOCALE}/work`, { waitUntil: 'networkidle' })
  const deep = await page.evaluate(
    () => document.querySelector('main a[href*="/work/"]')?.getAttribute('href') ?? null,
  )
  check(Boolean(deep), `hay fichas de proyecto enlazadas desde /work (${deep ?? 'ninguna'})`)
  if (deep) {
    await page.goto(`${BASE}${deep}`, { waitUntil: 'networkidle' })
    const relatives = await page.evaluate(() =>
      [...document.querySelectorAll('header a, footer a')]
        .map((a) => a.getAttribute('href') ?? '')
        .filter((href) => href && !/^(\/|#|https?:|mailto:|tel:)/.test(href)),
    )
    check(
      relatives.length === 0,
      relatives.length === 0
        ? 'los enlaces de cabecera y pie son absolutos'
        : `enlaces relativos (encadenarán y darán 404): ${relatives.join(', ')}`,
    )
  }

  // --- Áreas pulsables (WCAG 2.2: mínimo 24×24) -------------------------------
  const small = await page.evaluate(() =>
    [...document.querySelectorAll('a, button')]
      .map((element) => {
        const rect = element.getBoundingClientRect()
        const before = getComputedStyle(element, '::before')
        // La utilidad `tap` agranda el área con un pseudo-elemento invisible.
        const grow =
          before.content !== 'none' && before.position === 'absolute'
            ? Math.abs(Number.parseFloat(before.top) || 0) * 2
            : 0
        return {
          text: element.textContent.trim().slice(0, 30),
          height: rect.height + grow,
          width: rect.width,
        }
      })
      // El enlace "saltar al contenido" mide 1×1 mientras está oculto y crece al
      // recibir foco: es el patrón correcto, no un objetivo pequeño.
      .filter((element) => element.height > 2 && element.width > 2 && element.height < 24),
  )
  check(
    small.length === 0,
    small.length === 0
      ? 'todas las áreas pulsables llegan a 24 px'
      : `áreas pulsables por debajo de 24 px: ${JSON.stringify(small.slice(0, 5))}`,
  )

  // --- Indexación: sólo sangilstudio.com puede aparecer en Google ---------------
  // El proyecto de test despliega su rama como "production" de ese proyecto, así que
  // durante un tiempo sangilstudiotest.vercel.app se anunció como indexable y con
  // `Allow: /`. Si esto falla en un entorno que no sea el dominio real, hay que
  // revisar `lib/site-env.ts` antes de que Google lo indexe.
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
