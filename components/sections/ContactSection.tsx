import type { SiteSettings } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { sections } from '@/lib/i18n/routes'
import { InstagramIcon, MailIcon, WebIcon } from '@/components/layout/NavIcons'

/**
 * CONTACTO: la segunda y última sección de la portada.
 *
 * Es una sección, no una página: se llega bajando o pulsando «Contacto» en el menú.
 * Tiene dirección propia —`/es/contact`— pero el HTML es el de la portada; ver
 * `[section]/page.tsx`.
 *
 * El contenido está escrito literalmente por el estudio, línea a línea, y así se
 * respeta: una sola columna pegada al margen izquierdo, sin rejilla, sin encabezados de
 * subsección y sin nada centrado. La composición anterior repartía lo mismo en tres
 * columnas centradas con un filete por columna; era más «diseño» y menos tarjeta de
 * visita, que es lo que esto tiene que ser.
 *
 * Los huecos entre grupos son los que pidió el estudio: un salto de línea tras el
 * título y dos entre bloques. Se expresan en `em` sobre la interlínea del cuerpo
 * (1,7 × el tamaño de letra), así que un salto vale `1.7em` y dos, `3.4em`; escalan
 * solos si cambia la tipografía en vez de quedarse en píxeles fijos.
 *
 * Sin formulario a propósito: implicaría backend antispam y política de privacidad. Se
 * añadirá cuando el estudio lo decida (ver README).
 */
type ContactLink = {
  key: string
  href: string
  text: string
  Icon: (props: { className?: string }) => React.ReactElement
  /** Correo y teléfono se abren en la misma pestaña; la web y las redes, en otra. */
  external: boolean
}

export function ContactSection({ locale, settings }: { locale: Locale; settings: SiteSettings }) {
  const t = getDictionary(locale)

  /** Las tres líneas con icono. Instagram sólo si hay perfil declarado en el panel. */
  const links: ContactLink[] = [
    {
      key: 'email',
      href: `mailto:${settings.email}`,
      text: settings.email,
      Icon: MailIcon,
      external: false,
    },
    {
      key: 'website',
      href: settings.website,
      text: settings.websiteLabel,
      Icon: WebIcon,
      external: true,
    },
  ]

  if (settings.instagram && settings.instagramHandle) {
    links.push({
      key: 'instagram',
      href: settings.instagram,
      text: settings.instagramHandle,
      Icon: InstagramIcon,
      external: true,
    })
  }

  return (
    /**
     * La sección ocupa **la pantalla entera** aunque su contenido sea corto.
     *
     * No es un capricho de composición: la portada son dos bloques, y con el contacto
     * midiendo lo que mide su texto —unos 400 px— la página no daba de sí lo suficiente
     * para que el navegador pudiera subirlo hasta arriba. Entrando por `/es/contact` el
     * bloque se quedaba a media pantalla, con el hero todavía asomando por encima, que
     * es justo lo que esa dirección promete que no va a pasar. Lo cazó
     * `npm run check:mobile`. Con la altura completa, el desplazamiento llega y el
     * bloque queda donde tiene que quedar; de paso, la portada se lee como dos
     * pantallas y no como una foto con una coletilla debajo.
     *
     * El contenido va ARRIBA de esa pantalla, no centrado en ella. Centrado quedaba
     * mejor de un vistazo, pero lo empujaba 200 px hacia abajo y volvía a dejar la
     * página sin recorrido suficiente: el mismo fallo, más disimulado.
     */
    <div className="min-h-[100svh] pt-(--spacing-section)">
      {/* El `scroll-mt` despega el encabezado de la cabecera fija al llegar por la ruta. */}
      <section
        id={sections.contact}
        className="page-gutter scroll-mt-8 pb-(--spacing-section) text-left"
      >
        <h2 className="text-small tracking-[0.18em] uppercase">{t.contact.title}</h2>

        {/* `not-italic`: los navegadores ponen <address> en cursiva por defecto, y aquí
            es una dirección postal de verdad, que es justo para lo que existe la
            etiqueta. Sin `<br>`: cada línea es un bloque, y así el salto no depende de
            un elemento vacío. */}
        <address className="mt-[1.7em] text-body not-italic">
          <span className="block">{settings.street}</span>
          <span className="block">
            {settings.postalCode} {settings.city}, {settings.country[locale]}
          </span>
          <span className="block">T {settings.phone}</span>
        </address>

        <ul className="mt-[3.4em] space-y-1 text-body">
          {links.map(({ key, href: target, text, Icon, external }) => (
            <li key={key}>
              <a
                href={target}
                {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                className="tap inline-flex items-center gap-3"
              >
                <Icon className="h-4 w-4 shrink-0 text-ink-soft" />
                {/* `hover-bold` engorda el texto sin mover la línea: el pseudo-elemento
                    reserva de antemano el ancho de la negrita (ver globals.css). El
                    `data-text` tiene que decir exactamente lo mismo que hay dentro. */}
                <span className="hover-bold" data-text={text}>
                  {text}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Los socios cierran el bloque, en el orden del panel (Yago primero). */}
        <ul className="mt-[3.4em] text-body">
          {settings.team.map((member) => (
            <li key={member.name}>{member.name}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
