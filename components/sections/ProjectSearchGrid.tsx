'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ProjectCard } from '@/components/sections/ProjectCard'
import { Gallery, ratioOf } from '@/components/ui/Gallery'
import { GalleryToggle } from '@/components/ui/GalleryToggle'
import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

type Props = {
  projects: ProjectEntry[]
  locale: Locale
  dictionary: Dictionary
}

export function ProjectSearchGrid({ projects, locale, dictionary }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

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

  const suggestions = visible

  const count =
    visible.length === 1
      ? dictionary.work.resultsOne
      : dictionary.work.results.replace('{n}', String(visible.length))

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
      event.preventDefault()
      if (!suggestions.length) return
      setOpen(true)
      const step = event.key === 'ArrowDown' ? 1 : -1
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
      <div ref={containerRef} className="relative mx-auto w-full max-w-md">
        <label htmlFor="project-search" className="sr-only">
          {dictionary.work.search}
        </label>
        <input
          id="project-search"
          data-t="search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
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

        <ul
          id={listboxId}
          role="listbox"
          aria-label={dictionary.work.suggestions}
          hidden={!showList}
          className="scrollbar-hairline absolute top-full left-0 z-10 max-h-[24rem] w-full overflow-y-auto border-x border-b border-line bg-paper/80 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18)] backdrop-blur-md"
        >
          {suggestions.map((project, index) => (
            <li
              key={project.slug}
              id={`project-search-option-${index}`}
              data-t="searchOption"
              role="option"
              aria-selected={index === active}
              onPointerEnter={() => setActive(index)}
              onClick={() => go(project)}
              className={`cursor-pointer px-6 py-4 text-center text-body tracking-[0.14em] uppercase transition-colors duration-200 ease-(--ease-out-soft) ${
                index === active ? 'bg-paper-deep/70 text-ink' : 'text-ink-soft'
              } ${index > 0 ? 'border-t border-line/60' : ''}`}
            >
              {project.title}
            </li>
          ))}
        </ul>
      </div>

      <p aria-live="polite" className="sr-only">
        {count}
      </p>

      {visible.length === 0 ? (
        <p className="mt-16 text-body text-ink-soft">{dictionary.work.empty}</p>
      ) : (
        <>
          <div className="mt-12 flex justify-end md:mt-16">
            <GalleryToggle dictionary={dictionary} />
          </div>

          <div className="mt-6 md:mt-8">
            <Gallery
              items={visible.map((project, index) => ({
                key: project.slug,
                ratio: ratioOf(project.cover),
                content: <ProjectCard project={project} locale={locale} priority={index < 3} />,
              }))}
            />
          </div>
        </>
      )}
    </>
  )
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}
