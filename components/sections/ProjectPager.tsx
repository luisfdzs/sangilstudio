'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { ReactNode } from 'react'
import { ProjectPeek } from '@/components/sections/ProjectPeek'
import {
  enteringStyle,
  isGesturing,
  outgoingStyle,
  transitionStyle,
} from '@/components/swipe/motion'
import { EdgeArrows } from '@/components/ui/EdgeArrows'
import { useHorizontalSwipe } from '@/components/ui/useHorizontalSwipe'
import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

type Props = {
  previous: ProjectEntry
  next: ProjectEntry
  prevHref: string
  nextHref: string
  prevLabel: string
  nextLabel: string
  locale: Locale
  dictionary: Dictionary
  children: ReactNode
}

export function ProjectPager({
  previous,
  next,
  prevHref,
  nextHref,
  prevLabel,
  nextLabel,
  locale,
  dictionary,
  children,
}: Props) {
  const router = useRouter()

  const go = useCallback(
    (delta: number) => {
      router.push(delta < 0 ? prevHref : nextHref)
    },
    [router, prevHref, nextHref],
  )

  const { drag, handlers } = useHorizontalSwipe(go)

  const gesturing = isGesturing(drag)
  const arriving = drag.direction === 1 ? next : drag.direction === -1 ? previous : null

  return (
    <div {...handlers} className="relative touch-pan-y overflow-x-clip">
      <div style={gesturing ? { ...transitionStyle(drag), ...outgoingStyle(drag) } : undefined}>
        {children}
      </div>

      {arriving && (
        <div
          aria-hidden="true"
          /* Arranca bajo la cabecera, justo donde arrancará la ficha al soltar. */
          className="pointer-events-none fixed inset-x-0 top-20 bottom-0 z-20 md:top-24"
          style={{ ...transitionStyle(drag), ...enteringStyle(drag) }}
        >
          <ProjectPeek project={arriving} locale={locale} dictionary={dictionary} />
        </div>
      )}

      <EdgeArrows
        anchor="fixed"
        tone="ink"
        prevLabel={prevLabel}
        nextLabel={nextLabel}
        prevHref={prevHref}
        nextHref={nextHref}
      />
    </div>
  )
}
