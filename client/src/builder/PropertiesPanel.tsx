import { useState } from 'react'
import { ChevronDown, ChevronRight, MousePointer2 } from 'lucide-react'
import type { BlockConfig } from '@/blocks/types'
import { useConfigStore } from '@/store/configStore'
import { blockMetadata } from '@/lib/block-metadata'
import { widgetSchemas } from '@/widgets/schemas'
import { FieldRenderer } from './fields/FieldRenderer'

/**
 * The settings form for whichever widget is selected.
 *
 * It is built entirely from the widget's schema, so this file never mentions a
 * specific widget. Adding a widget means writing its schema — the panel picks
 * it up without being touched, which is the difference between a builder that
 * grows and one where every new widget costs another hand-written form.
 */

function Group({
  title,
  defaultOpen,
  children,
}: {
  title: string
  defaultOpen: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border-subtle last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center gap-1 px-3 py-2 text-left text-text-1 hover:text-text-0 transition-colors"
      >
        {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
        <span className="text-[11px] font-semibold tracking-wide uppercase">{title}</span>
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  )
}

export function PropertiesPanel({ block }: { block: BlockConfig | undefined }) {
  const updateBlock = useConfigStore((s) => s.updateBlock)
  const updateBlockProps = useConfigStore((s) => s.updateBlockProps)

  if (!block) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <MousePointer2 size={18} className="text-text-3 mb-2" />
        <p className="text-[11.5px] text-text-2">Nothing selected</p>
        <p className="text-[10.5px] text-text-3 mt-1 leading-relaxed">
          Click a section on the page to change its wording, photos and layout.
        </p>
      </div>
    )
  }

  const schema = widgetSchemas[block.type]
  const meta = blockMetadata.find((m) => m.type === block.type)

  if (!schema) {
    return (
      <div className="px-3 py-4">
        <p className="text-[11.5px] text-text-2">
          {meta?.label ?? block.type} has no settings yet.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-3 py-2.5 border-b border-border-default">
        <p className="text-[11.5px] font-semibold text-text-0">{meta?.label ?? block.type}</p>
        {meta?.description && (
          <p className="text-[10.5px] text-text-3 mt-0.5 leading-snug">{meta.description}</p>
        )}
      </div>

      {schema.groups.map((group, index) => (
        <Group key={group.title} title={group.title} defaultOpen={index === 0}>
          {Object.entries(group.fields).map(([key, field]) => (
            <FieldRenderer
              key={key}
              field={field}
              // `variant` is stored on the block itself; everything else lives
              // in props. Keeping that detail here means schemas can describe
              // both in one list.
              value={key === 'variant' ? block.variant : block.props[key]}
              onChange={(value) => {
                if (key === 'variant') {
                  updateBlock(block.id, { variant: value as string })
                } else {
                  updateBlockProps(block.id, { [key]: value })
                }
              }}
            />
          ))}
        </Group>
      ))}
    </div>
  )
}
