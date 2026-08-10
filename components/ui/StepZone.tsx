import { cn } from '@/lib/cn'

type Props = {
  side: 'left' | 'right'
  label: string
  onPress: () => void
  half?: boolean
}

/** Mitad o borde de la imagen que pasa a la anterior o la siguiente. Sólo con ratón. */
export function StepZone({ side, label, onPress, half = false }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onPress}
      className={cn(
        'absolute inset-y-0 hidden outline-offset-[-0.5rem] pointer-fine:block focus-visible:outline',
        side === 'left' ? 'left-0 cursor-step-prev' : 'right-0 cursor-step-next',
        half ? 'w-1/2' : 'w-[14%] max-w-32 min-w-16',
      )}
    />
  )
}
