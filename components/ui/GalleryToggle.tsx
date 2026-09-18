'use client'

import { useSyncExternalStore } from 'react'
import type { Dictionary } from '@/lib/i18n/dictionaries'

export const GALLERY_MODES = ['squares', 'rows'] as const
export type GalleryMode = (typeof GALLERY_MODES)[number]

export const GALLERY_DEFAULT: GalleryMode = 'squares'
export const GALLERY_STORAGE_KEY = 'sangil.gallery'

export const GALLERY_BOOT_SCRIPT = `try{var m=localStorage.getItem('${GALLERY_STORAGE_KEY}');if(m==='rows'||m==='squares')document.documentElement.dataset.gallery=m}catch(e){}`

const listeners = new Set<() => void>()

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function readMode(): GalleryMode {
  const value = document.documentElement.dataset.gallery
  return value === 'rows' || value === 'squares' ? value : GALLERY_DEFAULT
}

function serverMode(): GalleryMode {
  return GALLERY_DEFAULT
}

function applyMode(next: GalleryMode): void {
  document.documentElement.dataset.gallery = next
  try {
    window.localStorage.setItem(GALLERY_STORAGE_KEY, next)
  } catch {}
  for (const listener of listeners) listener()
}

export function GalleryToggle({ dictionary }: { dictionary: Dictionary }) {
  const mode = useSyncExternalStore(subscribe, readMode, serverMode)

  return (
    <div
      role="group"
      aria-label={dictionary.work.layout}
      className="hidden items-center gap-6 md:flex"
    >
      {GALLERY_MODES.map((option) => (
        <button
          key={option}
          type="button"
          data-t="galleryToggle"
          onClick={() => applyMode(option)}
          aria-pressed={mode === option}
          className={`tap text-micro tracking-[0.12em] uppercase transition-colors duration-300 ease-(--ease-out-soft) ${
            mode === option ? 'font-medium text-ink' : 'text-ink-faint hover:text-ink-soft'
          }`}
        >
          {dictionary.work[option]}
        </button>
      ))}
    </div>
  )
}
