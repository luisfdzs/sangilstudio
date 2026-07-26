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

  const menuButton = page.locator('header button[aria-controls="mobile-nav"]')
  check(await menuButton.isVisible(), 'el botón de menú se ve en móvil')
  check(
    !(await page.locator('header nav[aria-label="Principal"]').first().isVisible()),
    'la navegación de escritorio está oculta',
  )

  // --- Menú: abrir, bloquear scroll, cerrar, navegar --------------------------
  await menuButton.click()
  const panel = page.locator('#mobile-nav')
  const opened = await panel
    .waitFor({ state: 'visible', timeout: 4000 })
    .then(() => true)
    .catch(() => false)
  check(opened, 'el panel del menú se abre y ocupa la pantalla')

  const panelBox = await panel.boundingBox()
  check(
    (panelBox?.height ?? 0) > 400,
    `el panel tiene altura real (${Math.round(panelBox?.height ?? 0)} px)`,
  )
  check(
    (await page.evaluate(() => document.body.style.overflow)) === 'hidden',
    'el scroll de la página se bloquea con el menú abierto',
  )

  // La barra deja de ir en color papel al abrir el menú (contraste sobre papel).
  await page.waitForTimeout(700)
  const barColor = await page.evaluate(
    () => getComputedStyle(document.querySelector('.header-bar')).color,
  )
  check(barColor === 'rgb(20, 20, 15)', `la barra usa tinta con el menú abierto (${barColor})`)

  await page.keyboard.press('Escape')
  check(!(await panel.isVisible()), 'Escape cierra el menú')
  check(
    (await page.evaluate(() => document.body.style.overflow)) === '',
    'el scroll se restaura al cerrar',
  )

  await menuButton.click()
  await panel.locator('a').first().click()
  await page.waitForURL(`**/${LOCALE}/**`)
  check(!(await panel.isVisible()), 'el menú se cierra al navegar')
  check(
    (await page.evaluate(() => document.body.style.overflow)) === '',
    'el scroll queda desbloqueado tras navegar',
  )

  // --- Resto de plantillas ---------------------------------------------------
  for (const route of ['work', 'studio', 'contact']) {
    await page.goto(`${BASE}/${LOCALE}/${route}`, { waitUntil: 'networkidle' })
    check((await horizontalOverflow(page)) <= 1, `/${route} no desborda en horizontal`)
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
