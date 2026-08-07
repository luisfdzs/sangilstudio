'use client'

import Link from 'next/link'
import type { PointerEvent as ReactPointerEvent } from 'react'

type Props = {
  prevLabel: string
  nextLabel: string
  onPrev?: () => void
  onNext?: () => void
  prevHref?: string
  nextHref?: string
  anchor?: 'absolute' | 'fixed'
  tone?: 'paper' | 'ink'
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 20 40"
      fill="none"
      aria-hidden="true"
      className="h-9 w-[1.125rem] overflow-visible"
    >
      <path
        d={direction === 'left' ? 'M15 4 5 20l10 16' : 'M5 4l10 16L5 36'}
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

const trackPointer = (event: ReactPointerEvent<HTMLElement>) => {
  const box = event.currentTarget.getBoundingClientRect()
  const y = ((event.clientY - box.top) / box.height) * 100
  event.currentTarget.style.setProperty('--mark-y', `${Math.min(92, Math.max(8, y))}%`)
}

const FRAME = {
  absolute: 'absolute inset-y-0',
  fixed: 'fixed top-20 bottom-0 z-30 md:top-24',
}

const TONE = {
  paper: 'text-paper focus-visible:outline-paper',
  ink: 'text-ink focus-visible:outline-ink',
}

const MARK_TONE = {
  paper: 'drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]',
  ink: '',
}

export function EdgeArrows({
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
  prevHref,
  nextHref,
  anchor = 'absolute',
  tone = 'paper',
}: Props) {
  return (
    <>
      {(['left', 'right'] as const).map((direction) => {
        const left = direction === 'left'
        const href = left ? prevHref : nextHref
        const zone = `group hidden w-[14%] max-w-32 min-w-16 cursor-pointer outline-offset-[-0.5rem] pointer-fine:block focus-visible:outline ${FRAME[anchor]} ${TONE[tone]} ${
          left ? 'left-0' : 'right-0'
        }`
        const mark = (
          <span
            aria-hidden="true"
            className={`absolute grid -translate-y-1/2 place-items-center opacity-0 transition duration-300 ease-(--ease-out-soft) group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${MARK_TONE[tone]} ${
              left ? 'left-6 -translate-x-1.5 md:left-8' : 'right-6 translate-x-1.5 md:right-8'
            }`}
            style={{ top: 'var(--mark-y, 50%)' }}
          >
            <Chevron direction={direction} />
          </span>
        )

        return href ? (
          <Link
            key={direction}
            href={href}
            aria-label={left ? prevLabel : nextLabel}
            onPointerMove={trackPointer}
            className={zone}
          >
            {mark}
          </Link>
        ) : (
          <button
            key={direction}
            type="button"
            aria-label={left ? prevLabel : nextLabel}
            onClick={left ? onPrev : onNext}
            onPointerMove={trackPointer}
            className={zone}
          >
            {mark}
          </button>
        )
      })}
    </>
  )
}
