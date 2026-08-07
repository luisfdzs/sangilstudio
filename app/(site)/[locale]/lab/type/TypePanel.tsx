'use client'

import Link from 'next/link'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { googleFontsHref } from '@/components/typelab/families'
import { GROUPS, ROLES } from '@/components/typelab/roles'
import {
  ROLE_BY_ID,
  changedRoles,
  exportCss,
  getServerSnapshot,
  getSnapshot,
  hydrate,
  isChanged,
  setLive,
  styleOf,
  subscribe,
  type View,
} from '@/components/typelab/store'
import { TypeControls } from '@/components/typelab/TypeControls'

export function TypePanel({ homeHref }: { homeHref: string }) {
  const styles = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [selected, setSelected] = useState(ROLES[0]!.id)
  const [view, setView] = useState<View>('desktop')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    hydrate()
  }, [])

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
    <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-16">
      <link rel="stylesheet" href={googleFontsHref()} />

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <p className="eyebrow">Vista previa · pulsa cualquier texto para ajustarlo</p>
          <div role="group" aria-label="Ancho de la vista previa" className="flex gap-4">
            {(['mobile', 'desktop'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setView(option)}
                aria-pressed={view === option}
                className={`text-micro tracking-[0.12em] uppercase ${
                  view === option ? 'font-medium text-ink' : 'text-ink-faint hover:text-ink-soft'
                }`}
              >
                {option === 'mobile' ? 'Móvil 390' : 'Escritorio 1440'}
              </button>
            ))}
          </div>
        </div>

        <div
          className="mt-8 space-y-12"
          style={view === 'mobile' ? { maxWidth: '390px' } : undefined}
        >
          {GROUPS.map((group) => (
            <section key={group.id}>
              <h2 className="eyebrow border-b border-line/60 pb-2">{group.label}</h2>
              <div className="mt-6 space-y-6">
                {ROLES.filter((entry) => entry.group === group.id).map((entry) => (
                  <div key={entry.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(entry.id)}
                      className={`block w-full text-left outline-offset-4 ${
                        selected === entry.id ? 'outline outline-ink' : ''
                      }`}
                    >
                      <span
                        className="block whitespace-pre-line"
                        style={styleOf(styles[entry.id]!, view)}
                      >
                        {entry.sample}
                      </span>
                    </button>
                    <p className="mt-2 text-micro tracking-[0.12em] text-ink-faint uppercase">
                      {entry.label}
                      {isChanged(entry.id, styles[entry.id]!) && ' · modificado'}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24">
        <div className="border border-ink p-6">
          <p className="eyebrow">Verlo en la web de verdad</p>
          <p className="mt-3 text-small text-ink-soft">
            Enciende el panel flotante y navega por la web con estos valores aplicados a los textos
            reales.
          </p>
          <Link
            href={homeHref}
            onClick={() => setLive(true)}
            className="mt-4 block border border-ink px-4 py-3 text-center text-micro tracking-[0.12em] uppercase hover:bg-ink hover:text-paper"
          >
            Ir a la web con el panel
          </Link>
          <p className="mt-3 text-micro leading-relaxed text-ink-faint">
            Desde cualquier página, añadir <code>?type</code> a la dirección también lo enciende.
          </p>
        </div>

        <div className="mt-8 border border-line p-6">
          <p className="eyebrow">Ajustando</p>
          <h2 className="mt-2 text-title tracking-tight">{role.label}</h2>
          <p className="mt-2 text-small text-ink-soft">{role.where}</p>
          <p className="mt-1 text-micro text-ink-faint">hoy: {role.today}</p>

          <div className="mt-8">
            <TypeControls roleId={selected} style={styles[selected]!} />
          </div>
        </div>

        <div className="mt-8 border border-line p-6">
          <p className="eyebrow">
            {changed.length === 0
              ? 'Sin cambios todavía'
              : `${changed.length} de ${ROLES.length} textos modificados`}
          </p>

          <button
            type="button"
            onClick={copy}
            className="mt-4 w-full border border-ink px-4 py-3 text-micro tracking-[0.12em] uppercase hover:bg-ink hover:text-paper"
          >
            {copied ? 'CSS copiado' : 'Copiar el CSS de los 16 textos'}
          </button>

          <details className="mt-4">
            <summary className="text-small text-ink-soft">Ver el CSS</summary>
            <pre className="scrollbar-hairline mt-4 max-h-[24rem] overflow-auto bg-paper-deep p-4 text-[0.6875rem] leading-relaxed whitespace-pre-wrap">
              {exportCss(styles)}
            </pre>
          </details>

          <p className="mt-4 text-micro leading-relaxed text-ink-faint">
            Los tamaños salen como clamp() entre 390 y 1440 px, igual que el sistema actual.
          </p>
        </div>
      </aside>
    </div>
  )
}
