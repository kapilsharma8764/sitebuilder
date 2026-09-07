import { useState } from 'react'
import { ChevronDown, ChevronRight, GripVertical, ImageOff, Plus, Trash2, X } from 'lucide-react'
import type { Field, LinkValue, RepeaterItemField } from '@/widgets/field-types'

/**
 * Draws one control for one field.
 *
 * Every widget's settings form is built by walking its schema and calling this
 * for each field, so this file is the only place that knows what a "colour
 * picker" or a "repeater" looks like. Widgets stay declarations.
 */

const inputClass =
  'w-full px-2 py-1.5 rounded-md border border-border-default bg-bg-2 text-text-0 text-xs outline-none focus:border-brand placeholder:text-text-3 transition-colors'

function Row({
  label,
  help,
  children,
}: {
  label: string
  help?: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-3">
      <label className="block text-[11.5px] text-text-2 mb-1 font-medium">{label}</label>
      {children}
      {help && <p className="mt-1 text-[10.5px] text-text-3 leading-snug">{help}</p>}
    </div>
  )
}

function TextControl({
  value,
  placeholder,
  onChange,
}: {
  value: unknown
  placeholder?: string
  onChange: (v: string) => void
}) {
  return (
    <input
      type="text"
      value={typeof value === 'string' ? value : ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  )
}

function ImageControl({ value, onChange }: { value: unknown; onChange: (v: string) => void }) {
  const src = typeof value === 'string' ? value : ''
  const [broken, setBroken] = useState(false)

  return (
    <div className="flex gap-2">
      <div className="w-11 h-11 shrink-0 rounded-md border border-border-default bg-bg-2 overflow-hidden grid place-items-center">
        {src && !broken ? (
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setBroken(true)}
            onLoad={() => setBroken(false)}
          />
        ) : (
          <ImageOff size={14} className="text-text-3" />
        )}
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <input
          type="text"
          value={src}
          placeholder="https://…"
          onChange={(e) => {
            setBroken(false)
            onChange(e.target.value)
          }}
          className={inputClass}
        />
        {src && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="self-start text-[10px] text-text-3 hover:text-status-red transition-colors"
          >
            Remove photo
          </button>
        )}
      </div>
    </div>
  )
}

function ColorControl({ value, onChange }: { value: unknown; onChange: (v: string) => void }) {
  const color = typeof value === 'string' ? value : ''
  const valid = /^#[0-9a-fA-F]{6}$/.test(color)

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="color"
        // A colour input cannot show "nothing", so an unset field falls back
        // to black for the swatch only — the text box stays empty, and no
        // value is stored until the user actually picks one.
        value={valid ? color : '#000000'}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Pick a colour"
        className={`w-7 h-7 shrink-0 rounded-md border cursor-pointer p-0.5 bg-bg-2 ${
          valid ? 'border-border-default' : 'border-dashed border-border-hover'
        }`}
      />
      <input
        type="text"
        value={color}
        placeholder="Design colour"
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} font-mono`}
      />
      {color && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear colour"
          className="px-1.5 rounded-md text-text-3 hover:text-text-0 transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}

function SwitchControl({ value, onChange }: { value: unknown; onChange: (v: boolean) => void }) {
  const on = value === true
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative w-9 h-5 rounded-full transition-colors ${on ? 'bg-brand' : 'bg-bg-4'}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
          on ? 'left-[1.125rem]' : 'left-0.5'
        }`}
      />
    </button>
  )
}

function LinkControl({ value, onChange }: { value: unknown; onChange: (v: LinkValue) => void }) {
  const link: LinkValue =
    value && typeof value === 'object' ? (value as LinkValue) : { href: '', newTab: false }

  return (
    <div className="flex flex-col gap-1.5">
      <input
        type="text"
        value={link.href ?? ''}
        placeholder="https://…"
        onChange={(e) => onChange({ ...link, href: e.target.value })}
        className={inputClass}
      />
      <label className="flex items-center gap-1.5 text-[10.5px] text-text-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={link.newTab === true}
          onChange={(e) => onChange({ ...link, newTab: e.target.checked })}
          className="accent-brand"
        />
        Open in a new tab
      </label>
    </div>
  )
}

function StringsControl({
  value,
  field,
  onChange,
}: {
  value: unknown
  field: Extract<Field, { kind: 'strings' }>
  onChange: (v: string[]) => void
}) {
  const items = Array.isArray(value) ? (value as string[]) : []

  return (
    <div className="flex flex-col gap-1">
      {items.map((item, i) => (
        <div key={i} className="flex gap-1">
          <input
            type="text"
            value={item}
            placeholder={field.placeholder}
            onChange={(e) => {
              const next = [...items]
              next[i] = e.target.value
              onChange(next)
            }}
            className={inputClass}
          />
          <button
            type="button"
            aria-label={`Remove ${item || 'item'}`}
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="px-1.5 rounded-md text-text-3 hover:text-status-red hover:bg-bg-3 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="self-start flex items-center gap-1 mt-0.5 text-[10.5px] text-brand hover:text-brand-dim transition-colors"
      >
        <Plus size={10} />
        {field.addLabel ?? 'Add item'}
      </button>
    </div>
  )
}

/** Builds a blank entry from the repeater's declared fields. */
function emptyItem(fields: Record<string, RepeaterItemField>): Record<string, unknown> {
  const item: Record<string, unknown> = {}
  for (const [key, sub] of Object.entries(fields)) {
    item[key] = sub.kind === 'switch' ? false : sub.kind === 'number' ? 0 : sub.kind === 'strings' ? [] : ''
  }
  return item
}

function RepeaterControl({
  value,
  field,
  onChange,
}: {
  value: unknown
  field: Extract<Field, { kind: 'repeater' }>
  onChange: (v: Record<string, unknown>[]) => void
}) {
  const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : []
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  function update(index: number, key: string, next: unknown) {
    const copy = items.map((item, i) => (i === index ? { ...item, [key]: next } : item))
    onChange(copy)
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const copy = [...items]
    ;[copy[index], copy[target]] = [copy[target], copy[index]]
    onChange(copy)
    setOpenIndex(target)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item, i) => {
        const open = openIndex === i
        const titleValue = field.titleKey ? item[field.titleKey] : undefined
        const title =
          typeof titleValue === 'string' && titleValue.trim() ? titleValue : `Item ${i + 1}`

        return (
          <div key={i} className="rounded-md border border-border-default bg-bg-2 overflow-hidden">
            <div className="flex items-center gap-1 px-1.5 py-1.5">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex items-center gap-1 flex-1 min-w-0 text-left text-text-1 hover:text-text-0 transition-colors"
                aria-expanded={open}
              >
                {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                <span className="text-[11px] truncate">{title}</span>
              </button>

              <button
                type="button"
                aria-label="Move up"
                disabled={i === 0}
                onClick={() => move(i, -1)}
                className="p-0.5 rounded text-text-3 hover:text-text-0 disabled:opacity-30 disabled:hover:text-text-3 transition-colors"
              >
                <GripVertical size={11} className="rotate-180" />
              </button>
              <button
                type="button"
                aria-label={`Remove ${title}`}
                onClick={() => {
                  onChange(items.filter((_, idx) => idx !== i))
                  setOpenIndex(null)
                }}
                className="p-0.5 rounded text-text-3 hover:text-status-red transition-colors"
              >
                <Trash2 size={11} />
              </button>
            </div>

            {open && (
              <div className="px-2 pb-2 pt-1 border-t border-border-subtle">
                {Object.entries(field.fields).map(([key, sub]) => (
                  <FieldRenderer
                    key={key}
                    field={sub}
                    value={item[key]}
                    onChange={(next) => update(i, key, next)}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}

      <button
        type="button"
        onClick={() => {
          onChange([...items, emptyItem(field.fields)])
          setOpenIndex(items.length)
        }}
        className="self-start flex items-center gap-1 mt-0.5 text-[10.5px] text-brand hover:text-brand-dim transition-colors"
      >
        <Plus size={10} />
        {field.addLabel ?? 'Add item'}
      </button>
    </div>
  )
}

export function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: Field
  value: unknown
  onChange: (value: unknown) => void
}) {
  switch (field.kind) {
    case 'text':
      return (
        <Row label={field.label} help={field.help}>
          <TextControl value={value} placeholder={field.placeholder} onChange={onChange} />
        </Row>
      )

    case 'textarea':
      return (
        <Row label={field.label} help={field.help}>
          <textarea
            value={typeof value === 'string' ? value : ''}
            placeholder={field.placeholder}
            rows={field.rows ?? 3}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </Row>
      )

    case 'number':
      return (
        <Row label={field.label} help={field.help}>
          <div className="relative">
            <input
              type="number"
              value={typeof value === 'number' ? value : Number(value) || 0}
              min={field.min}
              max={field.max}
              step={field.step ?? 1}
              onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
              className={inputClass}
            />
            {field.unit && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-text-3 pointer-events-none">
                {field.unit}
              </span>
            )}
          </div>
        </Row>
      )

    case 'image':
      return (
        <Row label={field.label} help={field.help}>
          <ImageControl value={value} onChange={onChange} />
        </Row>
      )

    case 'color':
      return (
        <Row label={field.label} help={field.help}>
          <ColorControl value={value} onChange={onChange} />
        </Row>
      )

    case 'select':
      return (
        <Row label={field.label} help={field.help}>
          <select
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Row>
      )

    case 'switch':
      return (
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[11.5px] text-text-2 font-medium">{field.label}</span>
            {field.help && <p className="text-[10.5px] text-text-3 leading-snug">{field.help}</p>}
          </div>
          <SwitchControl value={value} onChange={onChange} />
        </div>
      )

    case 'link':
      return (
        <Row label={field.label} help={field.help}>
          <LinkControl value={value} onChange={onChange} />
        </Row>
      )

    case 'strings':
      return (
        <Row label={field.label} help={field.help}>
          <StringsControl value={value} field={field} onChange={onChange} />
        </Row>
      )

    case 'repeater':
      return (
        <Row label={field.label} help={field.help}>
          <RepeaterControl value={value} field={field} onChange={onChange} />
        </Row>
      )
  }
}
