import Link from 'next/link'
import { Chevron } from '@/components/ui/Chevron'

type Props = {
  href: string
  label: string
  title: string
  project: string
  architects?: string | null
  anchor?: 'fixed' | 'absolute'
}

const FRAME = {
  fixed: 'fixed z-30 bg-paper/95 backdrop-blur-md',
  absolute: 'absolute bg-paper',
}

export function ProjectBar({ href, label, title, project, architects, anchor = 'fixed' }: Props) {
  return (
    <div
      className={`page-gutter inset-x-0 bottom-0 flex min-h-16 items-center justify-between gap-6 md:min-h-20 md:py-3 ${FRAME[anchor]}`}
    >
      <Link
        href={href}
        title={title}
        className="tap group flex shrink-0 items-center gap-2 text-ink transition-colors duration-300 hover:text-ink-soft"
      >
        <Chevron
          direction="left"
          className="h-4 w-2 transition-transform duration-300 ease-(--ease-out-soft) group-hover:-translate-x-1"
        />
        <span data-t="backLink" className="text-micro uppercase">
          {label}
        </span>
      </Link>

      <div className="hidden min-w-0 text-right md:block">
        <p data-t="cardTitle" className="text-small font-medium tracking-wide uppercase">
          {project}
        </p>
        {architects && (
          <p data-t="cardLocation" className="mt-1 text-small text-ink-soft">
            {architects}
          </p>
        )}
      </div>
    </div>
  )
}
