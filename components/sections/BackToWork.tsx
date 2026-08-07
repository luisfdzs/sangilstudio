import Link from 'next/link'
import { Chevron } from '@/components/ui/Chevron'

type Props = {
  href: string
  label: string
  title: string
}

export function BackToWork({ href, label, title }: Props) {
  return (
    <div className="page-gutter fixed inset-x-0 bottom-0 z-30 flex h-16 items-center bg-paper/95 backdrop-blur-md md:h-20">
      <Link
        href={href}
        title={title}
        className="tap group flex items-center gap-2 text-ink transition-colors duration-300 hover:text-ink-soft"
      >
        <Chevron
          direction="left"
          className="h-4 w-2 transition-transform duration-300 ease-(--ease-out-soft) group-hover:-translate-x-1"
        />
        <span data-t="backLink" className="text-micro uppercase">
          {label}
        </span>
      </Link>
    </div>
  )
}
