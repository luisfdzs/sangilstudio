import {
  SANGIL_PATH,
  STUDIO_OPACITY,
  STUDIO_PATH,
  STUDIO_TRANSFORM,
  VIEW_BOX,
} from '@/lib/brand/wordmark'
import { cn } from '@/lib/cn'

export function Wordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={VIEW_BOX.horizontal}
      className={cn('w-auto', className)}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" d={SANGIL_PATH} />
      <g transform={STUDIO_TRANSFORM.horizontal} opacity={STUDIO_OPACITY}>
        <path fillRule="evenodd" d={STUDIO_PATH} />
      </g>
    </svg>
  )
}
