'use client'

import { useId } from 'react'
import { FAMILIES } from './families'
import { PALETTE, type Transform } from './roles'
import { resetAll, resetRole, update, type RoleStyle } from './store'

export function TypeControls({ roleId, style }: { roleId: string; style: RoleStyle }) {
  const uid = useId()
  const familyId = `${uid}-family`
  const transformId = `${uid}-transform`

  return (
    <div className="space-y-5">
      <Field label="Tipografía" htmlFor={familyId}>
        <select
          id={familyId}
          value={style.family}
          onChange={(event) => update(roleId, { family: event.target.value as never })}
          className="w-full border border-line bg-paper px-3 py-2 text-small"
        >
          {FAMILIES.map((family) => (
            <option key={family.id} value={family.id}>
              {family.label}
            </option>
          ))}
        </select>
      </Field>

      <Slider
        label="Tamaño en móvil"
        value={style.sizeMobile}
        min={8}
        max={120}
        step={1}
        unit="px"
        onChange={(value) => update(roleId, { sizeMobile: value })}
      />
      <Slider
        label="Tamaño en escritorio"
        value={style.sizeDesktop}
        min={8}
        max={160}
        step={1}
        unit="px"
        onChange={(value) => update(roleId, { sizeDesktop: value })}
      />
      <Slider
        label="Grosor"
        value={style.weight}
        min={100}
        max={900}
        step={50}
        onChange={(value) => update(roleId, { weight: value })}
      />
      <Slider
        label="Altura de línea"
        value={style.lineHeight}
        min={0.8}
        max={2.4}
        step={0.01}
        onChange={(value) => update(roleId, { lineHeight: value })}
      />
      <Slider
        label="Espaciado entre letras"
        value={style.letterSpacing}
        min={-0.08}
        max={0.4}
        step={0.005}
        unit="em"
        onChange={(value) => update(roleId, { letterSpacing: value })}
      />
      <Slider
        label="Espaciado entre palabras"
        value={style.wordSpacing}
        min={-0.1}
        max={1}
        step={0.01}
        unit="em"
        onChange={(value) => update(roleId, { wordSpacing: value })}
      />

      <Field label="Caja" htmlFor={transformId}>
        <select
          id={transformId}
          value={style.transform}
          onChange={(event) => update(roleId, { transform: event.target.value as Transform })}
          className="w-full border border-line bg-paper px-3 py-2 text-small"
        >
          <option value="none">Como se escribe</option>
          <option value="uppercase">MAYÚSCULAS</option>
          <option value="lowercase">minúsculas</option>
          <option value="capitalize">Iniciales En Mayúscula</option>
        </select>
      </Field>

      <label className="flex items-center gap-3 text-small">
        <input
          type="checkbox"
          checked={style.italic}
          onChange={(event) => update(roleId, { italic: event.target.checked })}
        />
        Cursiva
      </label>

      <Field label="Color">
        <div className="flex flex-wrap items-center gap-2">
          {PALETTE.map((entry) => (
            <button
              key={entry.value}
              type="button"
              onClick={() => update(roleId, { color: entry.value })}
              aria-label={entry.label}
              aria-pressed={style.color === entry.value}
              title={entry.label}
              className={`h-7 w-7 border ${
                style.color === entry.value ? 'border-ink' : 'border-line'
              }`}
              style={{ backgroundColor: entry.value }}
            />
          ))}
          <input
            type="color"
            value={style.color}
            onChange={(event) => update(roleId, { color: event.target.value })}
            aria-label="Color libre"
            className="h-7 w-10 border border-line bg-paper"
          />
          <span className="text-micro text-ink-faint">{style.color}</span>
        </div>
      </Field>

      <Slider
        label="Opacidad"
        value={style.opacity}
        min={0.1}
        max={1}
        step={0.01}
        onChange={(value) => update(roleId, { opacity: value })}
      />

      <div className="flex flex-wrap gap-4 border-t border-line pt-4">
        <button
          type="button"
          onClick={() => resetRole(roleId)}
          className="text-micro tracking-[0.12em] text-ink-soft uppercase hover:text-ink"
        >
          Restablecer este texto
        </button>
        <button
          type="button"
          onClick={() => resetAll()}
          className="text-micro tracking-[0.12em] text-ink-faint uppercase hover:text-ink"
        >
          Restablecer todo
        </button>
      </div>
    </div>
  )
}

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) {
  const text = 'mb-2 block text-micro tracking-[0.12em] text-ink-soft uppercase'

  return (
    <div>
      {htmlFor ? (
        <label htmlFor={htmlFor} className={text}>
          {label}
        </label>
      ) : (
        <p className={text}>{label}</p>
      )}
      {children}
    </div>
  )
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (value: number) => void
}) {
  const unique = useId()
  const id = `slider-${label.replace(/\s+/g, '-').toLowerCase()}-${unique}`

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-micro tracking-[0.12em] text-ink-soft uppercase">
          {label}
        </label>
        <span className="text-small tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-ink"
      />
    </div>
  )
}
