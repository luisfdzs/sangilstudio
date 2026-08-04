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
 * Los dos primeros son de un menú desplegable en la cabecera, que es exactamente lo
 * que el rediseño ha vuelto a poner —un «+» arriba a la derecha que despliega el menú
 * a pantalla completa—, así que las dos comprobaciones vuelven a estar vivas y son la
 * razón de que el panel se dibuje FUERA del <header> (ver `components/layout/Header`).
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

  // La portada son dos bloques y nada más: el hero y el contacto. Sin pie de página.
  check(
    (await page.locator('main > *').count()) === 2,
    `la portada tiene dos bloques (${await page.locator('main > *').count()})`,
  )
  check(!(await page.locator('footer').count()), 'no hay pie de página')

  // El hero ocupa la pantalla y es un enlace a proyectos: es la única forma de entrar.
  const hero = page.locator('[data-hero]')
  const heroBox = await hero.boundingBox()
  check(
    Math.abs((heroBox?.height ?? 0) - 844) <= 2,
    `el hero ocupa la pantalla completa (${Math.round(heroBox?.height ?? 0)} px)`,
  )
  check(
    (await hero.getAttribute('href'))?.endsWith('/work') === true,
    `el hero lleva a proyectos (${await hero.getAttribute('href')})`,
  )

  // --- El menú: el «+» de la esquina, a pantalla completa ----------------------
  const toggle = page.locator('header button[aria-controls="mobile-menu"]')
  check(await toggle.isVisible(), 'el botón «+» se ve en la esquina superior derecha')

  // A la derecha del todo: si se descolocara, el pulgar buscaría donde no está.
  const toggleBox = await toggle.boundingBox()
  check(
    (toggleBox?.x ?? 0) + (toggleBox?.width ?? 0) > 390 - 40,
    `el «+» está pegado al borde derecho (${Math.round((toggleBox?.x ?? 0) + (toggleBox?.width ?? 0))} px)`,
  )

  await toggle.click()
  const panel = page.locator('#mobile-menu')
  const opened = await panel
    .waitFor({ state: 'visible', timeout: 4000 })
    .then(() => true)
    .catch(() => false)
  check(opened, 'el menú se abre')

  // Fallo nº 2 del historial: con el panel dentro de un header con `backdrop-blur`
  // medía 0 px de alto. Tiene que ocupar la pantalla ENTERA.
  const panelBox = await panel.boundingBox()
  check(
    Math.abs((panelBox?.height ?? 0) - 844) <= 2 && Math.abs((panelBox?.width ?? 0) - 390) <= 2,
    `el menú ocupa toda la pantalla (${Math.round(panelBox?.width ?? 0)}×${Math.round(panelBox?.height ?? 0)})`,
  )

  // Fallo nº 1: el texto del menú en color papel sobre fondo papel. Se comprueba que
  // hay contraste de verdad entre el color del enlace y el fondo del panel.
  const legible = await page.evaluate(() => {
    const link = document.querySelector('#mobile-menu a')
    if (!link) return false
    const luminance = (color) => {
      const [r, g, b] = color.match(/\d+(\.\d+)?/g).map(Number)
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    }
    const panelBackground = getComputedStyle(document.getElementById('mobile-menu')).backgroundColor
    return Math.abs(luminance(getComputedStyle(link).color) - luminance(panelBackground)) > 0.4
  })
  check(legible, 'el texto del menú contrasta con su fondo')

  // Las entradas van CENTRADAS en la pantalla (2026-08-04, referencia: Swiftmet). Se mide
  // el desvío del centro de cada enlace respecto al centro del panel; si alguien devolviera
  // el `flex` al panel de fuera, el `hidden` volvería a discutir con él y esto lo cazaría.
  const offCentre = await page.evaluate(() => {
    const middle = window.innerWidth / 2
    return Math.max(
      ...[...document.querySelectorAll('#mobile-menu nav > a')].map((link) => {
        const box = link.getBoundingClientRect()
        return Math.abs((box.left + box.right) / 2 - middle)
      }),
    )
  })
  check(offCentre <= 2, `el menú está centrado (${Math.round(offCentre)} px de desvío)`)

  // El «−» que lo cierra vive en la cabecera y tiene que quedar POR ENCIMA del panel.
  check(
    await toggle.isVisible(),
    'el botón sigue accesible con el menú abierto (se convierte en «−»)',
  )
  await toggle.click()
  check(!(await panel.isVisible()), 'el «−» cierra el menú')

  await toggle.click()
  await page.keyboard.press('Escape')
  check(!(await panel.isVisible()), 'Escape cierra el menú')

  // --- Áreas pulsables de la cabecera (WCAG 2.2: mínimo 24×24) -----------------
  const tightHeader = await page.evaluate(() =>
    [...document.querySelectorAll('header a, header button')]
      // Primero se descarta lo que no se ve, y sólo después se mide.
      //
      // El orden importa: la navegación de escritorio está en el DOM con `display:none`
      // en móvil, así que su alto real es 0, pero la utilidad `tap` le sigue calculando
      // un pseudo-elemento de 12,8 px. Sumando antes de filtrar, esos cinco enlaces
      // invisibles se contaban como objetivos pequeños y el script fallaba señalando un
      // problema que no existe. También cae aquí el enlace «saltar al contenido», que
      // mide 1×1 mientras está oculto y crece al recibir foco: es el patrón correcto.
      .filter((element) => element.getBoundingClientRect().height > 2)
      .map((element) => {
        const before = getComputedStyle(element, '::before')
        // La utilidad `tap` agranda el área con un pseudo-elemento invisible.
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

  // --- Contacto: sección de la portada, con ruta propia ------------------------
  // Se entra por `/es/contact` y se comprueba que devuelve la portada con la sección
  // colocada bajo la cabecera fija, no tapada por ella. Es el contrato de la ruta: si
  // el salto se hiciera antes de que la página asiente, el encabezado quedaría oculto
  // —pasó con las fuentes, ver `ScrollToSection`— y esto lo cazaría.
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
  // La mejora es la URL: nada de almohadilla en la barra de direcciones.
  check(!(await page.evaluate(() => location.hash)), '/contact no deja almohadilla en la URL')

  // Los enlaces del bloque de contacto: los tres con icono tienen que ser pulsables.
  const contactLinks = page.locator('#contact ul a')
  check(
    (await contactLinks.count()) >= 2,
    `el contacto tiene sus enlaces (${await contactLinks.count()})`,
  )

  // --- El estudio ya es una página de verdad ----------------------------------
  await page.goto(`${BASE}/${LOCALE}/studio`, { waitUntil: 'networkidle' })
  check(
    (await page.locator('h1').first().isVisible()) && !(await page.locator('[data-hero]').count()),
    '/studio es una página propia, no la portada',
  )
  check((await horizontalOverflow(page)) <= 1, '/studio no desborda en horizontal')

  // El estudio es SÓLO el manifiesto: las columnas de equipo y colaboradores se quitaron
  // el 2026-08-04 (los socios se leen en el bloque de contacto de la portada).
  check(!(await page.locator('main section').count()), '/studio no lleva equipo ni colaboradores')

  // --- Proyectos: una columna, cuadradas, y el buscador filtra -----------------
  await page.goto(`${BASE}/${LOCALE}/work`, { waitUntil: 'networkidle' })
  check((await horizontalOverflow(page)) <= 1, '/work no desborda en horizontal')

  // El título «PROYECTOS» no se ve, pero el <h1> sigue en el HTML para lectores de
  // pantalla: si alguien lo borrara del todo, la página se anunciaría sin nombre.
  //
  // Se mide el tamaño y no `isVisible()`: un elemento `sr-only` mide 1×1 px y sigue
  // teniendo caja, así que Playwright lo da por visible. Lo que se comprueba es que el
  // encabezado exista y no ocupe sitio.
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

  // Una sola columna en móvil: todas las tarjetas empiezan en la misma x.
  const columns = await page.evaluate(
    () =>
      new Set(
        [...document.querySelectorAll('main article')].map((card) =>
          Math.round(card.getBoundingClientRect().x),
        ),
      ).size,
  )
  check(columns === 1, `una sola columna en móvil (${columns})`)

  // Las fotos son cuadradas, no verticales de móvil.
  const squares = await page.evaluate(() => {
    const boxes = [...document.querySelectorAll('main article img')].map((img) =>
      img.getBoundingClientRect(),
    )
    return boxes.every((box) => Math.abs(box.width - box.height) <= 2)
  })
  check(squares, 'las imágenes de la rejilla son cuadradas')

  // El buscador: contiene, sin mayúsculas y sin acentos.
  const search = page.locator('#project-search')
  check(await search.isVisible(), 'el buscador se ve')

  // Centrado en su fila: sin título encima es lo primero que se ve, y descolgado a la
  // izquierda quedaba huérfano. Se mide que sobre lo mismo a un lado que al otro.
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

  // El desplegable de títulos: cuelga del campo al enfocarlo, se reduce a los que casan
  // y al elegir uno se va a su ficha. En móvil importa además que no desborde a lo ancho.
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

  // Elegir un título nos ha dejado en una ficha: lo de abajo mira la rejilla otra vez.
  await page.goto(`${BASE}/${LOCALE}/work`, { waitUntil: 'networkidle' })

  // --- Enlaces absolutos, comprobado desde una página PROFUNDA -----------------
  // `href()` devolvía rutas relativas (`es/work`): desde la portada funcionaban por
  // casualidad y desde una ficha encadenaban → /es/work/es/work → 404. Se comprueba
  // desde el nivel más profundo del sitio, que es donde se notaba.
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

    // La ficha: las imágenes van a una sola columna y a todo el ancho.
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
