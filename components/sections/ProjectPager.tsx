'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { ProjectPeek } from '@/components/sections/ProjectPeek'
import {
  enteringStyle,
  isGesturing,
  outgoingStyle,
  transitionStyle,
} from '@/components/swipe/motion'
import { useHorizontalSwipe } from '@/components/ui/useHorizontalSwipe'
import type { ProjectEntry } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

type Props = {
  previous: ProjectEntry
  next: ProjectEntry
  prevHref: string
  nextHref: string
  backHref: string
  backLabel: string
  backTitle: string
  locale: Locale
  dictionary: Dictionary
  children: ReactNode
}

type Committed = { direction: -1 | 1; project: ProjectEntry; from: string }

export function ProjectPager({
  previous,
  next,
  prevHref,
  nextHref,
  backHref,
  backLabel,
  backTitle,
  locale,
  dictionary,
  children,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [committed, setCommitted] = useState<Committed | null>(null)

  const go = useCallback(
    (delta: number) => {
      const direction: -1 | 1 = delta < 0 ? -1 : 1
      setCommitted({ direction, project: direction < 0 ? previous : next, from: pathname })
      router.push(direction < 0 ? prevHref : nextHref)
    },
    [router, pathname, prevHref, nextHref, previous, next],
  )

  const { drag, handlers } = useHorizontalSwipe(go)

  const held = committed?.from === pathname ? committed : null

  const gesturing = isGesturing(drag)
  const arriving = held
    ? held.project
    : drag.direction === 1
      ? next
      : drag.direction === -1
        ? previous
        : null

  const outgoing: CSSProperties | undefined = held
    ? { transform: `translateX(${-held.direction * 100}%)` }
    : gesturing
      ? { ...transitionStyle(drag), ...outgoingStyle(drag) }
      : undefined

  const entering: CSSProperties = held
    ? { transform: 'translateX(0%)' }
    : { ...transitionStyle(drag), ...enteringStyle(drag) }

  return (
    <div {...handlers} className="relative touch-pan-y overflow-x-clip">
      <div style={outgoing}>{children}</div>

      {arriving && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-20 bottom-0 z-40 md:top-24"
          style={entering}
        >
          <ProjectPeek
            project={arriving}
            locale={locale}
            dictionary={dictionary}
            backHref={backHref}
            backLabel={backLabel}
            backTitle={backTitle}
          />
        </div>
      )}
    </div>
  )
}
