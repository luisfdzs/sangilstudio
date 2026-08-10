import { Chevron } from '@/components/ui/Chevron'
import { cn } from '@/lib/cn'

type Props = {
  side: 'left' | 'right'
  label: string
  onPress: () => void
  tone?: 'paper' | 'ink'
}

const TONE = {
  paper:
    'text-paper [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.7))_drop-shadow(0_0_10px_rgba(0,0,0,0.5))] focus-visible:outline-paper',
  ink: 'text-ink focus-visible:outline-ink',
}

/** Borde de la sección que pasa a la imagen anterior o la siguiente. Sólo con ratón. */
export function StepZone({ side, label, onPress, tone = 'paper' }: Props) {
  const left = side === 'left'

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onPress}
      className={cn(
        'group absolute inset-y-0 hidden w-[14%] max-w-32 min-w-16 items-center',
        'outline-offset-[-0.5rem] pointer-fine:flex focus-visible:outline',
        left ? 'left-0 justify-start pl-4 md:pl-6' : 'right-0 justify-end pr-4 md:pr-6',
        TONE[tone],
      )}
    >
      <Chevron
        direction={side}
        className={cn(
          'h-4 w-2 transition-transform duration-300 ease-(--ease-out-soft)',
          left ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1',
        )}
      />
    </button>
  )
}
