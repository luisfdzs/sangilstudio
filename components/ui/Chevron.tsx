export function Chevron({
  direction,
  className = 'h-9 w-[1.125rem]',
}: {
  direction: 'left' | 'right'
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 20 40"
      fill="none"
      aria-hidden="true"
      className={`${className} overflow-visible`}
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
