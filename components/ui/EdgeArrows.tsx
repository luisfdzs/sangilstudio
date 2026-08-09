'use client'

import Link from 'next/link'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Chevron } from '@/components/ui/Chevron'

type Anchor = 'absolute' | 'fixed' | 'flow'
type Tone = 'paper' | 'ink'

type ArrowProps = {
  side: 'left' | 'right'
  label: string
  onPress?: () => void
  href?: string
  anchor?: Anchor
  tone?: Tone
}

type Props = {
  prevLabel: string
  nextLabel: string
  onPrev?: () => void
  onNext?: () => void
  prevHref?: string
  nextHref?: string
  anchor?: Anchor
  tone?: Tone
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const INSET = 16

const trackPointer = (event: ReactPointerEvent<HTMLElement>, follows: boolean) => {
  const box = event.currentTarget.getBoundingClientRect()

  if (!follows) {
    const y = ((event.clientY - box.top) / box.height) * 100
    event.currentTarget.style.setProperty('--mark-y', `${clamp(y, 8, 92)}%`)
    return
  }

  const x = clamp(event.clientX - box.left, INSET, box.width - INSET)
  const y = clamp(event.clientY - box.top, INSET, box.height - INSET)
  event.currentTarget.style.setProperty('--mark-x', `${x}px`)
  event.currentTarget.style.setProperty('--mark-y', `${y}px`)
}

const FRAME = {
  absolute: 'absolute inset-y-0 w-[14%] max-w-32 min-w-16',
  fixed: 'fixed top-20 bottom-16 z-30 w-[14%] max-w-32 min-w-16 md:top-24 md:bottom-20',
  flow: 'relative h-full min-w-16 flex-1',
}

const SIDE = {
  absolute: { left: 'left-0', right: 'right-0' },
  fixed: { left: 'left-0', right: 'right-0' },
  flow: { left: '', right: '' },
}

const TONE = {
  paper: 'text-paper focus-visible:outline-paper',
  ink: 'text-ink focus-visible:outline-ink',
}

const MARK_TONE = {
  paper: 'drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]',
  ink: '',
}

export function EdgeArrow({
  side,
  label,
  onPress,
  href,
  anchor = 'absolute',
  tone = 'paper',
}: ArrowProps) {
  const left = side === 'left'
  const zone = `group hidden cursor-pointer outline-offset-[-0.5rem] pointer-fine:block focus-visible:outline ${FRAME[anchor]} ${TONE[tone]} ${SIDE[anchor][side]}`

  const follows = anchor === 'flow'

  const mark = follows ? (
    <span
      aria-hidden="true"
      className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center opacity-0 transition-opacity duration-300 ease-(--ease-out-soft) group-hover:opacity-100 group-focus-visible:opacity-100 ${MARK_TONE[tone]}`}
      style={{ left: 'var(--mark-x, 50%)', top: 'var(--mark-y, 50%)' }}
    >
      <Chevron direction={side} />
    </span>
  ) : (
    <span
      aria-hidden="true"
      className={`absolute grid -translate-y-1/2 place-items-center opacity-0 transition duration-300 ease-(--ease-out-soft) group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${MARK_TONE[tone]} ${
        left ? 'left-6 -translate-x-1.5 md:left-8' : 'right-6 translate-x-1.5 md:right-8'
      }`}
      style={{ top: 'var(--mark-y, 50%)' }}
    >
      <Chevron direction={side} />
    </span>
  )

  return href ? (
    <Link
      href={href}
      aria-label={label}
      onPointerMove={(event) => trackPointer(event, follows)}
      className={zone}
    >
      {mark}
    </Link>
  ) : (
    <button
      type="button"
      aria-label={label}
      onClick={onPress}
      onPointerMove={(event) => trackPointer(event, follows)}
      className={zone}
    >
      {mark}
    </button>
  )
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
      <EdgeArrow
        side="left"
        label={prevLabel}
        onPress={onPrev}
        href={prevHref}
        anchor={anchor}
        tone={tone}
      />
      <EdgeArrow
        side="right"
        label={nextLabel}
        onPress={onNext}
        href={nextHref}
        anchor={anchor}
        tone={tone}
      />
    </>
  )
}
