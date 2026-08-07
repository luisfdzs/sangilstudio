import type { CSSProperties, ReactNode } from 'react'
import type { DescribedImage } from '@/lib/content'

export type GalleryItem = {
  key: string
  ratio: number
  content: ReactNode
}

const PER_ROW = 3

export function Gallery({ items }: { items: GalleryItem[] }) {
  const rows: GalleryItem[][] = []
  for (let index = 0; index < items.length; index += PER_ROW) {
    rows.push(items.slice(index, index + PER_ROW))
  }

  return (
    <div className="gallery">
      {rows.map((row) => {
        const average = row.reduce((sum, item) => sum + item.ratio, 0) / row.length

        return (
          <div key={row[0]!.key} className="gallery-row">
            {row.map((item) => (
              <div key={item.key} className="gallery-item" style={ratioStyle(item.ratio)}>
                {item.content}
              </div>
            ))}

            {Array.from({ length: PER_ROW - row.length }, (_, index) => (
              <div
                key={`fill-${index}`}
                aria-hidden="true"
                className="gallery-fill"
                style={ratioStyle(average)}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

export function ratioOf(image: DescribedImage): number {
  return image.width / image.height
}

function ratioStyle(ratio: number): CSSProperties {
  return { '--ratio': ratio.toFixed(4) } as CSSProperties
}
