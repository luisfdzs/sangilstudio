'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ProjectCard } from '@/components/sections/ProjectCard'
import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

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
 *
 * **El desplegable de títulos.** Al enfocar el campo cuelga de él la lista de títulos de
 * todos los proyectos, y se va reduciendo a los que casan mientras se escribe: sirve para
 * ver de un golpe qué hay antes de saber qué buscar, y para llegar a un proyecto sin
 * bajar a la rejilla. Elegir un título **navega** a su ficha —es lo que se espera al
 * pinchar el nombre de una obra—, mientras que la rejilla de abajo sigue filtrándose con
 * lo escrito. Es un `combobox` de manual: `ArrowUp`/`ArrowDown` recorren, `Enter` abre el
 * resaltado (y si no hay ninguno, sólo cierra), `Escape` cierra sin perder lo escrito.
 */
export function ProjectSearchGrid({ projects, locale, dictionary }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  /** Índice resaltado en el desplegable; `-1` es «ninguno», el estado de partida. */
  const [active, setActive] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

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

  /* El desplegable enseña exactamente los mismos proyectos que la rejilla: una sola
     noción de «coincide», para que la lista no prometa resultados que abajo no están. */
  const suggestions = visible

  const count =
    visible.length === 1
      ? dictionary.work.resultsOne
      : dictionary.work.results.replace('{n}', String(visible.length))

  /* Un clic fuera cierra. Se escucha el `pointerdown` del documento y no el `blur` del
     campo, porque el `blur` se dispara ANTES del clic en una opción y se llevaría el
     desplegable por delante justo cuando se está eligiendo algo de él. */
  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function go(project: ProjectEntry) {
    setOpen(false)
    router.push(href(locale, 'work', project.slug))
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setOpen(false)
      setActive(-1)
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      // La flecha, en un campo de texto, mueve el cursor: aquí mueve el resaltado.
      event.preventDefault()
      if (!suggestions.length) return
      setOpen(true)
      const step = event.key === 'ArrowDown' ? 1 : -1
      // Recorrido circular en el que «ninguno» (-1) es una posición más: la primera
      // flecha abajo lleva al primer título y la primera flecha arriba, al último.
      setActive((current) => {
        const total = suggestions.length
        const next = current + step
        if (next < -1) return total - 1
        if (next >= total) return -1
        return next
      })
      return
    }

    if (event.key === 'Enter') {
      const chosen = suggestions[active]
      if (chosen) {
        event.preventDefault()
        go(chosen)
      } else {
        setOpen(false)
      }
    }
  }

  const listboxId = 'project-search-listbox'
  const showList = open && suggestions.length > 0

  return (
    <>
      {/* Centrado en su fila (`mx-auto`): sin el título encima, el campo es lo primero que
          se ve al entrar y descolgado a la izquierda quedaba huérfano. La rejilla de abajo
          sigue ocupando todo el ancho. */}
      <div ref={containerRef} className="relative mx-auto w-full max-w-md">
        <label htmlFor="project-search" className="sr-only">
          {dictionary.work.search}
        </label>
        {/* Un filete y nada más: en una página que es casi toda fotografía, una caja con
            borde y fondo se leería como un elemento de formulario suelto. `type="search"`
            para que el móvil ofrezca el teclado adecuado y la crucecita de borrar.
            El texto va centrado para que lo escrito caiga en el mismo eje que los títulos
            del desplegable: si el campo alineara a la izquierda y la lista al centro, al
            teclear se vería un salto entre lo que se escribe y lo que se ofrece. */}
        <input
          id="project-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            /* Al escribir cambia la lista, y el índice que había resaltaría otro
               proyecto —o ninguno, si la lista se acortó—: se vuelve a «ninguno». */
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={dictionary.work.search}
          autoComplete="off"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            showList && active >= 0 ? `project-search-option-${active}` : undefined
          }
          className="w-full border-b border-line bg-transparent py-4 text-center text-lead tracking-wide placeholder:text-ink-faint focus:border-ink focus:outline-none"
        />

        {/* Flota sobre la rejilla (de ahí el fondo opaco y el `z-10`) y se limita en alto
            para que con treinta y un proyectos no tape la página entera.
            Sin borde arriba: el filete del campo hace de tapa y así la lista se lee como
            continuación del buscador y no como una caja aparte pegada debajo. La sombra
            es larguísima y muy tenue —lo justo para separar del blanco de la página—,
            porque una sombra marcada delataría un menú de sistema en una web que es
            papel y fotografía. */}
        <ul
          id={listboxId}
          role="listbox"
          aria-label={dictionary.work.suggestions}
          hidden={!showList}
          className="scrollbar-hairline absolute top-full left-0 z-10 max-h-[24rem] w-full overflow-y-auto border-x border-b border-line bg-paper shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18)]"
        >
          {suggestions.map((project, index) => (
            /* Cada título respira: centrado, en versalitas espaciadas y con una fila alta,
               que es lo que hace que la lista se lea como un índice de proyectos y no como
               el autocompletado de un formulario. El resaltado se limita a subir el texto
               de gris a negro sobre un fondo apenas insinuado —el mismo `paper-deep` de
               los hovers del resto de la web— en lugar de invertir la fila. */
            <li
              key={project.slug}
              id={`project-search-option-${index}`}
              role="option"
              aria-selected={index === active}
              onPointerEnter={() => setActive(index)}
              onClick={() => go(project)}
              className={`cursor-pointer px-6 py-4 text-center text-body tracking-[0.14em] uppercase transition-colors duration-200 ease-(--ease-out-soft) ${
                index === active ? 'bg-paper-deep text-ink' : 'text-ink-soft'
              } ${index > 0 ? 'border-t border-line/60' : ''}`}
            >
              {project.title}
            </li>
          ))}
        </ul>
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
