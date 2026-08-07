'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { ReactNode } from 'react'
import { EdgeArrows } from '@/components/ui/EdgeArrows'
import { useHorizontalSwipe } from '@/components/ui/useHorizontalSwipe'

type Props = {
  prevHref: string
  nextHref: string
  prevLabel: string
  nextLabel: string
  children: ReactNode
}

export function ProjectPager({ prevHref, nextHref, prevLabel, nextLabel, children }: Props) {
  const router = useRouter()

  const go = useCallback(
    (delta: number) => {
      router.push(delta < 0 ? prevHref : nextHref)
    },
    [router, prevHref, nextHref],
  )

  const { handlers } = useHorizontalSwipe(go)

  return (
    <div {...handlers} className="touch-pan-y">
      {children}
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
