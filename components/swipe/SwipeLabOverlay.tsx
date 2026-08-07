'use client'

import { useEffect, useState } from 'react'
import { PRESETS, PRESET_BY_ID, type SwipeMotion } from './presets'
import {
  exportSettings,
  hydrate,
  isChanged,
  reset,
  setLive,
  update,
  useSwipeLive,
  useSwipeSettings,
} from './store'

/**
 * Panel para elegir el efecto de deslizar en el móvil. Se abre añadiendo
 * `?swipe` a cualquier dirección y no existe para el resto de visitantes.
 * Lo elegido se prueba en vivo en la portada y en la ficha de proyecto.
 */
export function SwipeLabOverlay() {
  const settings = useSwipeSettings()
  const live = useSwipeLive()
  const [open, setOpen] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    hydrate()
    if (new URLSearchParams(window.location.search).has('swipe')) setLive(true)
  }, [])

  if (!live) return null

  const preset = PRESET_BY_ID[settings.motion]

  function choose(motion: SwipeMotion) {
    update(PRESET_BY_ID[motion].settings)
    setCopied(false)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(exportSettings(settings))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <aside
      aria-label="Panel de deslizamiento"
      className="scrollbar-hairline fixed right-4 bottom-4 left-4 z-[100] max-h-[70svh] overflow-y-auto border border-ink bg-paper p-5 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)] sm:left-auto sm:w-[21rem] print:hidden"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-micro tracking-[0.12em] uppercase">Deslizar en el móvil</p>
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
          <p className="text-micro leading-relaxed text-ink-faint">
            Pruébalo con el dedo en la portada o en una ficha de proyecto. Con ratón no hay gesto:
            en escritorio se pasa con las flechas de los lados.
          </p>

          <fieldset className="space-y-2">
            <legend className="mb-2 text-micro tracking-[0.12em] text-ink-soft uppercase">
              Efecto
            </legend>
            {PRESETS.map((option) => (
              <label
                key={option.id}
                className={`block cursor-pointer border p-3 transition-colors duration-200 ease-(--ease-out-soft) ${
                  settings.motion === option.id
                    ? 'border-ink'
                    : 'border-line hover:border-ink-faint'
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="swipe-motion"
                    value={option.id}
                    checked={settings.motion === option.id}
                    onChange={() => choose(option.id)}
                  />
                  <span className="text-small font-medium">{option.label}</span>
                </span>
                <span className="mt-1 block pl-7 text-micro leading-relaxed text-ink-faint">
                  {option.hint}
                </span>
              </label>
            ))}
          </fieldset>

          <div className="space-y-4 border-t border-line pt-4">
            <Slider
              id="swipe-distance"
              label="Recorrido para pasar"
              value={settings.distance}
              min={0.08}
              max={0.5}
              step={0.01}
              format={(value) => `${Math.round(value * 100)} % del ancho`}
              onChange={(value) => update({ distance: value })}
            />
            <Slider
              id="swipe-resistance"
              label="Resistencia"
              value={settings.resistance}
              min={0}
              max={0.9}
              step={0.05}
              format={(value) => (value === 0 ? 'sigue al dedo' : value.toFixed(2))}
              onChange={(value) => update({ resistance: value })}
              disabled={settings.motion === 'jump'}
            />
            <Slider
              id="swipe-settle"
              label="Encaje al soltar"
              value={settings.settle}
              min={0}
              max={900}
              step={20}
              format={(value) => `${value} ms`}
              onChange={(value) => update({ settle: value })}
              disabled={settings.motion === 'jump'}
            />

            <label className="flex items-center gap-3 text-small">
              <input
                type="checkbox"
                checked={settings.flick}
                onChange={(event) => update({ flick: event.target.checked })}
              />
              Pasar también con gesto rápido
            </label>
          </div>

          <div className="border-t border-line pt-4">
            <p className="text-micro leading-relaxed text-ink-faint">
              {isChanged(settings)
                ? `Probando: ${preset.label}. Aún no es lo que ve el visitante.`
                : 'Estos son los valores que sirve la web ahora mismo.'}
            </p>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={copy}
                className="flex-1 border border-ink px-4 py-2 text-micro tracking-[0.12em] uppercase hover:bg-ink hover:text-paper"
              >
                {copied ? 'Copiado' : 'Copiar ajustes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset()
                  setCopied(false)
                }}
                className="border border-line px-4 py-2 text-micro tracking-[0.12em] text-ink-soft uppercase hover:border-ink hover:text-ink"
              >
                Deshacer
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

type SliderProps = {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (value: number) => string
  onChange: (value: number) => void
  disabled?: boolean
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  disabled = false,
}: SliderProps) {
  return (
    <div className={disabled ? 'opacity-40' : undefined}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-small">
          {label}
        </label>
        <span className="text-micro text-ink-faint tabular-nums">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-ink"
      />
    </div>
  )
}
