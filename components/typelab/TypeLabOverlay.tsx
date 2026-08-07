'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { googleFontsHref } from './families'
import { GROUPS, ROLES } from './roles'
import {
  ROLE_BY_ID,
  changedRoles,
  exportCss,
  getServerSnapshot,
  getSnapshot,
  hydrate,
  isLive,
  isLiveServer,
  liveCss,
  setLive,
  subscribe,
} from './store'
import { TypeControls } from './TypeControls'

const HIGHLIGHT = (roleId: string) =>
  `[data-t='${roleId}'] { outline: 1px dashed #9a9a9a; outline-offset: 6px; }`

export function TypeLabOverlay() {
  const pathname = usePathname()
  const styles = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const live = useSyncExternalStore(subscribe, isLive, isLiveServer)
  const [selected, setSelected] = useState(ROLES[0]!.id)
  const [open, setOpen] = useState(true)
  const [highlight, setHighlight] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    hydrate()
    if (new URLSearchParams(window.location.search).has('type')) setLive(true)
  }, [])

  if (!live || pathname.includes('/lab/')) return null

  const role = ROLE_BY_ID[selected]!
  const changed = changedRoles(styles)

  async function copy() {
    try {
      await navigator.clipboard.writeText(exportCss(styles))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <link rel="stylesheet" href={googleFontsHref()} />
      <style>{liveCss(styles)}</style>
      {highlight && <style>{HIGHLIGHT(selected)}</style>}

      <aside
        aria-label="Panel de tipografía"
        className="scrollbar-hairline fixed right-4 bottom-4 z-[100] max-h-[85svh] w-[21rem] max-w-[calc(100vw-2rem)] overflow-y-auto border border-ink bg-paper p-5 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)] print:hidden"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-micro tracking-[0.12em] uppercase">Tipografía en vivo</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              className="text-micro tracking-[0.12em] text-ink-soft uppercase hover:text-ink"
            >
              {open ? 'Plegar' : 'Abrir'}
            </button>
            <button
              type="button"
              onClick={() => setLive(false)}
              className="text-micro tracking-[0.12em] text-ink-faint uppercase hover:text-ink"
            >
              Salir
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-5 space-y-5">
            <div>
              <label
                htmlFor="typelab-role"
                className="mb-2 block text-micro tracking-[0.12em] text-ink-soft uppercase"
              >
                Texto
              </label>
              <select
                id="typelab-role"
                value={selected}
                onChange={(event) => setSelected(event.target.value)}
                className="w-full border border-line bg-paper px-3 py-2 text-small"
              >
                {GROUPS.map((group) => (
                  <optgroup key={group.id} label={group.label}>
                    {ROLES.filter((entry) => entry.group === group.id).map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.label}
                        {changed.includes(entry.id) ? ' ·' : ''}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <p className="mt-2 text-micro leading-relaxed text-ink-faint">{role.where}</p>
            </div>

            <label className="flex items-center gap-3 text-small">
              <input
                type="checkbox"
                checked={highlight}
                onChange={(event) => setHighlight(event.target.checked)}
              />
              Señalar en la página
            </label>

            <TypeControls roleId={selected} style={styles[selected]!} />

            <div className="border-t border-line pt-4">
              <p className="text-micro tracking-[0.12em] text-ink-faint uppercase">
                {changed.length === 0
                  ? 'Sin cambios'
                  : `${changed.length} de ${ROLES.length} modificados`}
              </p>
              <button
                type="button"
                onClick={copy}
                className="mt-3 w-full border border-ink px-4 py-2 text-micro tracking-[0.12em] uppercase hover:bg-ink hover:text-paper"
              >
                {copied ? 'CSS copiado' : 'Copiar el CSS'}
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
