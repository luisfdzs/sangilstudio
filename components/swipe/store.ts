'use client'

import { useSyncExternalStore } from 'react'
import { DEFAULT_SETTINGS, type SwipeSettings } from './presets'

export const STORAGE_KEY = 'sangil.swipe'
export const LIVE_KEY = 'sangil.swipe.live'

let settings: SwipeSettings = DEFAULT_SETTINGS
let live = false
const listeners = new Set<() => void>()

function emit(): void {
  for (const listener of listeners) listener()
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): SwipeSettings {
  return live ? settings : DEFAULT_SETTINGS
}

function getServerSnapshot(): SwipeSettings {
  return DEFAULT_SETTINGS
}

export function isLive(): boolean {
  return live
}

function isLiveServer(): boolean {
  return false
}

/** Los ajustes que debe usar la web: los de fábrica salvo con el panel abierto. */
export function useSwipeSettings(): SwipeSettings {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useSwipeLive(): boolean {
  return useSyncExternalStore(subscribe, isLive, isLiveServer)
}

export function update(patch: Partial<SwipeSettings>): void {
  settings = { ...settings, ...patch }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {}
  emit()
}

export function reset(): void {
  settings = DEFAULT_SETTINGS
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {}
  emit()
}

export function setLive(next: boolean): void {
  live = next
  try {
    window.localStorage.setItem(LIVE_KEY, next ? '1' : '0')
  } catch {}
  emit()
}

export function hydrate(): void {
  let changed = false

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      settings = { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<SwipeSettings>) }
      changed = true
    }
  } catch {}

  try {
    const next = window.localStorage.getItem(LIVE_KEY) === '1'
    if (next !== live) {
      live = next
      changed = true
    }
  } catch {}

  if (changed) emit()
}

export function isChanged(current: SwipeSettings): boolean {
  return JSON.stringify(current) !== JSON.stringify(DEFAULT_SETTINGS)
}

/** El bloque listo para pegar en `presets.ts` cuando se elija uno. */
export function exportSettings(current: SwipeSettings): string {
  return `export const DEFAULT_SETTINGS: SwipeSettings = {
  motion: '${current.motion}',
  distance: ${current.distance},
  resistance: ${current.resistance},
  settle: ${current.settle},
  flick: ${current.flick},
}`
}
