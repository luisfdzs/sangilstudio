import type { CSSProperties } from 'react'
import { FAMILY_BY_ID } from './families'
import { DEFAULT_STATE, ROLES, ROLE_BY_ID, type RoleStyle } from './roles'

export const STORAGE_KEY = 'sangil.type-lab'
export const LIVE_KEY = 'sangil.type-lab.live'

export type State = Record<string, RoleStyle>
export type View = 'mobile' | 'desktop'

let state: State = DEFAULT_STATE
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

export function getSnapshot(): State {
  return state
}

export function getServerSnapshot(): State {
  return DEFAULT_STATE
}

export function isLive(): boolean {
  return live
}

export function isLiveServer(): boolean {
  return false
}

function persist(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export function update(roleId: string, patch: Partial<RoleStyle>): void {
  state = { ...state, [roleId]: { ...state[roleId]!, ...patch } }
  persist()
  emit()
}

export function resetRole(roleId: string): void {
  state = { ...state, [roleId]: DEFAULT_STATE[roleId]! }
  persist()
  emit()
}

export function resetAll(): void {
  state = DEFAULT_STATE
  persist()
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
      const saved = JSON.parse(raw) as Partial<State>
      const merged: State = { ...DEFAULT_STATE }
      for (const role of ROLES) {
        const entry = saved[role.id]
        if (entry) merged[role.id] = { ...role.defaults, ...entry }
      }
      state = merged
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

export function styleOf(style: RoleStyle, view: View): CSSProperties {
  return {
    fontFamily: FAMILY_BY_ID[style.family].stack,
    fontSize: `${view === 'mobile' ? style.sizeMobile : style.sizeDesktop}px`,
    fontWeight: style.weight,
    lineHeight: style.lineHeight,
    letterSpacing: `${style.letterSpacing}em`,
    wordSpacing: `${style.wordSpacing}em`,
    textTransform: style.transform,
    fontStyle: style.italic ? 'italic' : 'normal',
    color: style.color,
    opacity: style.opacity,
  }
}

export function fluidSize(mobile: number, desktop: number): string {
  if (mobile === desktop) return `${mobile}px`
  const slope = (desktop - mobile) / (1440 - 390)
  const vw = Number((slope * 100).toFixed(4))
  const offset = Number((mobile - (vw / 100) * 390).toFixed(3))
  const sign = offset < 0 ? '-' : '+'
  return `clamp(${Math.min(mobile, desktop)}px, ${vw}vw ${sign} ${Math.abs(offset)}px, ${Math.max(
    mobile,
    desktop,
  )}px)`
}

function declarations(style: RoleStyle): string[] {
  return [
    `font-family: ${FAMILY_BY_ID[style.family].cssName};`,
    `font-size: ${fluidSize(style.sizeMobile, style.sizeDesktop)};`,
    `font-weight: ${style.weight};`,
    `line-height: ${style.lineHeight};`,
    `letter-spacing: ${style.letterSpacing}em;`,
    `word-spacing: ${style.wordSpacing}em;`,
    `text-transform: ${style.transform};`,
    `font-style: ${style.italic ? 'italic' : 'normal'};`,
    `color: ${style.color};`,
    `opacity: ${style.opacity};`,
  ]
}

/** CSS que se inyecta en la web para verla con los valores elegidos. */
export function liveCss(current: State): string {
  return ROLES.map((role) => {
    const body = declarations(current[role.id]!)
      .map((line) => `  ${line}`)
      .join('\n')
    return `[data-t='${role.id}'] {\n${body}\n}`
  }).join('\n')
}

/** CSS para llevar al sistema de diseño, con su comentario. */
export function exportCss(current: State): string {
  return ROLES.map((role) => {
    const body = declarations(current[role.id]!)
      .map((line) => `  ${line}`)
      .join('\n')
    return `/* ${role.label} — ${role.where}\n   hoy: ${role.today} */\n[data-t='${role.id}'] {\n${body}\n}`
  }).join('\n\n')
}

export function isChanged(roleId: string, style: RoleStyle): boolean {
  return JSON.stringify(style) !== JSON.stringify(DEFAULT_STATE[roleId])
}

export function changedRoles(current: State): string[] {
  return ROLES.filter((role) => isChanged(role.id, current[role.id]!)).map((role) => role.id)
}

export { ROLES, ROLE_BY_ID, DEFAULT_STATE }
export type { RoleStyle }
