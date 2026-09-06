import { RotateCcw } from 'lucide-react'
import type { BlockConfig, BlockStyle } from '@/blocks/types'
import { isEmptyStyle } from '@/blocks/block-style'
import { useConfigStore } from '@/store/configStore'
import { FieldRenderer } from './fields/FieldRenderer'
import type { Field } from '@/widgets/field-types'

/**
 * Size, spacing and styling for whichever section is selected.
 *
 * This is the brief's "resize, reposition, style, font", built the way
 * Elementor builds it — controls that apply to the selected section, rather
 * than free dragging on a canvas. Sections still stack in order; what changes
 * here is how wide each one runs, how much air it has, and how it is coloured
 * and set.
 *
 * Every control starts blank, meaning "use the design's own value". That is
 * what keeps a template looking designed until someone deliberately changes
 * something.
 */

const fields: Record<string, Field> = {
  width: {
    kind: 'select',
    label: 'Content width',
    options: [
      { value: 'full', label: 'Full width' },
      { value: 'centered', label: 'Centred column' },
      { value: 'narrow', label: 'Narrow column' },
    ],
  },
  paddingTop: { kind: 'number', label: 'Space above', min: 0, max: 240, step: 4, unit: 'px' },
  paddingBottom: { kind: 'number', label: 'Space below', min: 0, max: 240, step: 4, unit: 'px' },
  background: { kind: 'color', label: 'Background colour' },
  backgroundImage: { kind: 'image', label: 'Background photo' },
  radius: { kind: 'number', label: 'Corner rounding', min: 0, max: 48, step: 2, unit: 'px' },
  textAlign: {
    kind: 'select',
    label: 'Text alignment',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Centre' },
      { value: 'right', label: 'Right' },
    ],
  },
  textColor: { kind: 'color', label: 'Text colour' },
  fontFamily: {
    kind: 'select',
    label: 'Font',
    help: 'Leave on Design font to follow the site’s own typeface.',
    options: [
      { value: '', label: 'Design font' },
      { value: 'Inter', label: 'Inter' },
      { value: 'DM Sans', label: 'DM Sans' },
      { value: 'Poppins', label: 'Poppins' },
      { value: 'Playfair Display', label: 'Playfair Display' },
      { value: 'Space Grotesk', label: 'Space Grotesk' },
      { value: 'Bebas Neue', label: 'Bebas Neue' },
    ],
  },
  fontScale: {
    kind: 'number',
    label: 'Text size',
    min: 60,
    max: 160,
    step: 5,
    unit: '%',
    help: '100% is the size the design intends.',
  },
  hidden: {
    kind: 'switch',
    label: 'Hide this section',
    help: 'Kept in the page so you can bring it back.',
  },
}

const GROUPS: { title: string; keys: (keyof BlockStyle)[] }[] = [
  { title: 'Size and space', keys: ['width', 'paddingTop', 'paddingBottom', 'radius'] },
  { title: 'Colour', keys: ['background', 'backgroundImage', 'textColor'] },
  { title: 'Text', keys: ['textAlign', 'fontFamily', 'fontScale'] },
  { title: 'Visibility', keys: ['hidden'] },
]

export function StylePanel({ block }: { block: BlockConfig | undefined }) {
  const updateBlock = useConfigStore((s) => s.updateBlock)

  if (!block) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-[11.5px] text-text-2">Nothing selected</p>
        <p className="mt-1 text-[10.5px] text-text-3 leading-relaxed">
          Click a section to change its width, spacing and colours.
        </p>
      </div>
    )
  }

  const style = block.style ?? {}

  function set(key: keyof BlockStyle, value: unknown) {
    // An emptied control removes the override rather than storing a blank,
    // so the section goes back to the design's own value.
    const next: BlockStyle = { ...style, [key]: value === '' ? undefined : value }
    updateBlock(block!.id, { style: next })
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-3 py-2.5 border-b border-border-default flex items-center justify-between gap-2">
        <p className="text-[11.5px] font-semibold text-text-0">Section style</p>
        {!isEmptyStyle(block.style) && (
          <button
            type="button"
            onClick={() => updateBlock(block.id, { style: undefined })}
            className="flex items-center gap-1 text-[10.5px] text-text-3 hover:text-text-0 transition-colors"
          >
            <RotateCcw size={10} />
            Reset
          </button>
        )}
      </div>

      {GROUPS.map((group) => (
        <div key={group.title} className="px-3 py-3 border-b border-border-subtle last:border-b-0">
          <p className="mb-2 text-[11px] font-semibold tracking-wide uppercase text-text-2">
            {group.title}
          </p>
          {group.keys.map((key) => (
            <FieldRenderer
              key={key}
              field={fields[key]}
              value={style[key] ?? ''}
              onChange={(value) => set(key, value)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
