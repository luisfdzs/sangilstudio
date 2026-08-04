'use client'

import { useMemo, useState } from 'react'
import { ProjectCard } from '@/components/sections/ProjectCard'
import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

type Props = {
  projects: ProjectEntry[]
  locale: Locale
  dictionary: Dictionary
}

/**
 * LA REJILLA DE PROYECTOS, CON BUSCADOR.
 *
 * Tres columnas en escritorio, una en móvil, y un campo arriba que va dejando a la vista
 * sólo los proyectos que casan con lo escrito. Se filtra en el navegador y no en el
 * servidor porque los proyectos son unas decenas y ya vienen todos en la página: pedir
 * al servidor en cada tecla sería más lento y además exigiría renderizado dinámico, con
 * lo que la web dejaría de ser estática por un buscador.
 *
 * Las tres reglas del match, que el estudio pidió expresamente:
 *  - **contiene**, no «empieza por» — buscar «casa» encuentra «Rehabilitación de casa».
 *  - **sin distinguir mayúsculas** — «PAMPLONA» y «pamplona» son lo mismo.
 *  - **sin distinguir acentos** — «rehabilitacion» encuentra «Rehabilitación», y al
 *    revés: se normalizan los dos lados, no sólo el texto escrito.
 *
 * Se busca en todo lo que se ve de una tarjeta y en lo que se piensa al buscarla:
 * nombre, ubicación, año y tipo de obra ya traducido, para que «vivienda» encuentre las
 * viviendas aunque esa palabra no esté escrita en ningún título.
 */
export function ProjectSearchGrid({ projects, locale, dictionary }: Props) {
  const [query, setQuery] = useState('')

  /** El texto sobre el que se busca, ya normalizado, calculado una sola vez. */
  const haystacks = useMemo(
    () =>
      projects.map((project) =>
        normalize(
          [
            project.title,
            project.location[locale],
            String(project.year),
            dictionary.type[project.type],
          ].join(' '),
        ),
      ),
    [projects, locale, dictionary],
  )

  const needle = normalize(query)
  const visible = needle
    ? projects.filter((_, index) => haystacks[index]!.includes(needle))
    : projects

  const count =
    visible.length === 1
      ? dictionary.work.resultsOne
      : dictionary.work.results.replace('{n}', String(visible.length))

  return (
    <>
      <div className="mt-10 md:mt-14">
        <label htmlFor="project-search" className="sr-only">
          {dictionary.work.search}
        </label>
        {/* Un filete y nada más: en una página que es casi toda fotografía, una caja con
            borde y fondo se leería como un elemento de formulario suelto. `type="search"`
            para que el móvil ofrezca el teclado adecuado y la crucecita de borrar. */}
        <input
          id="project-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={dictionary.work.search}
          autoComplete="off"
          className="w-full max-w-sm border-b border-line bg-transparent py-3 text-body placeholder:text-ink-faint focus:border-ink focus:outline-none"
        />
      </div>

      {/* El recuento no se ve: se anuncia. Quien filtra con el ratón ya ve cómo cambia la
          rejilla, pero con lector de pantalla el cambio ocurre en silencio. */}
      <p aria-live="polite" className="sr-only">
        {count}
      </p>

      {visible.length === 0 ? (
        <p className="mt-16 text-body text-ink-soft">{dictionary.work.empty}</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 md:mt-16 md:grid-cols-3 md:gap-x-8 md:gap-y-16">
          {visible.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale}
              // Las tres primeras son las que se ven sin bajar en escritorio.
              priority={index < 3}
            />
          ))}
        </div>
      )}
    </>
  )
}

/**
 * Minúsculas y sin acentos. `NFD` separa cada letra acentuada en letra + tilde, y el
 * reemplazo se lleva las tildes; así «Rehabilitación» y «rehabilitacion» acaban siendo
 * la misma cadena. Se aplica igual a lo escrito y a lo buscado.
 */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}
