import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectCard } from '@/components/sections/ProjectCard'
import { Reveal } from '@/components/ui/Reveal'
import { getProjects } from '@/lib/content'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

/** Prerrenderiza esta página para cada idioma. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return { title: getDictionary(locale).work.title }
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const projects = await getProjects()

  return (
    <div className="page-gutter pt-16 pb-(--spacing-section) text-center md:pt-24">
      {/* `mx-auto` en los dos: llevan ancho máximo, y una caja estrecha sin centrar deja
          el texto centrado dentro de un bloque pegado a la izquierda. */}
      <header className="mx-auto max-w-2xl">
        <h1 className="text-display font-serif text-balance">{t.work.title}</h1>
        <p className="mx-auto mt-6 max-w-xl text-lead text-ink-soft">{t.work.lead}</p>
      </header>

      <div className="mt-16 grid gap-x-8 gap-y-16 md:mt-24 md:grid-cols-2 md:gap-y-24">
        {projects.map((project, index) => {
          const wide = index % 5 === 0
          return (
            <Reveal
              key={project.slug}
              step={index % 2}
              className={wide ? 'md:col-span-2' : undefined}
            >
              <ProjectCard
                project={project}
                locale={locale}
                priority={index === 0}
                span={wide ? 'wide' : 'half'}
              />
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
