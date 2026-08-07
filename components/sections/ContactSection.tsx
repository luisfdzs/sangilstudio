import type { SiteSettings } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { sections } from '@/lib/i18n/routes'
import { InstagramIcon, MailIcon, WebIcon } from '@/components/layout/NavIcons'

type ContactLink = {
  key: string
  href: string
  text: string
  Icon: (props: { className?: string }) => React.ReactElement
  external: boolean
}

export function ContactSection({ locale, settings }: { locale: Locale; settings: SiteSettings }) {
  const t = getDictionary(locale)

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
    <div className="min-h-[100svh] pt-(--spacing-section)">
      <section
        id={sections.contact}
        className="page-gutter scroll-mt-8 pb-(--spacing-section) text-left"
      >
        <h2 data-t="contactHeading" className="text-small tracking-[0.18em] uppercase">
          {t.contact.title}
        </h2>

        <address data-t="contactBody" className="mt-[1.7em] text-body not-italic">
          <span className="block">{settings.street}</span>
          <span className="block">
            {settings.postalCode} {settings.city}, {settings.country[locale]}
          </span>
          <span className="block">T {settings.phone}</span>
        </address>

        <ul data-t="contactBody" className="mt-[3.4em] space-y-1 text-body">
          {links.map(({ key, href: target, text, Icon, external }) => (
            <li key={key}>
              <a
                href={target}
                {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                className="tap inline-flex items-center gap-3"
              >
                <Icon className="h-4 w-4 shrink-0 text-ink-soft" />
                <span className="hover-bold" data-text={text}>
                  {text}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <ul data-t="contactBody" className="mt-[3.4em] text-body">
          {settings.team.map((member) => (
            <li key={member.name}>{member.name}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
