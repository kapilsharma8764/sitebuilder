import { useState } from 'react'
import { toast } from 'sonner'
import { Search, Layout, Type, Grid3X3, DollarSign, Megaphone, PanelBottom, MessageSquare, BarChart3, HelpCircle, Users, Mail, Newspaper, Image, Plus, Minus, Flag, FileText, ImageIcon, Play, GalleryHorizontalEnd, MapPin, MessageCircle, PieChart, Clock, Package } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { LayersPanel } from './LayersPanel'
import { PagesPanel } from '@/builder/PagesPanel'
import { useConfigStore } from '@/store/configStore'
import { useEditorStore } from '@/store/editorStore'
import { blockMetadata } from '@/lib/block-metadata'
import type { BlockType, BlockConfig } from '@/blocks/types'
import { newId } from '@/lib/id'

const blockIcons: Record<BlockType, typeof Layout> = {
  navbar: Layout, hero: Type, features: Grid3X3, pricing: DollarSign,
  cta: Megaphone, footer: PanelBottom, testimonials: MessageSquare,
  stats: BarChart3, faq: HelpCircle, team: Users, contact: Mail,
  newsletter: Newspaper, logocloud: Image, divider: Minus, banner: Flag,
  content: FileText, image: ImageIcon, video: Play, gallery: GalleryHorizontalEnd,
  map: MapPin, whatsapp: MessageCircle, chart: PieChart, hours: Clock, slider: GalleryHorizontalEnd, products: Package,
}

/**
 * One widget in the library.
 *
 * Draggable onto the page, and clickable for anyone who would rather not drag
 * — on a laptop trackpad, dragging across the screen is real work.
 */
function WidgetItem({
  meta,
  icon: Icon,
  onAdd,
}: {
  meta: (typeof blockMetadata)[number]
  icon: typeof Layout
  onAdd: () => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `widget-${meta.type}`,
    data: { kind: 'new', type: meta.type },
  })

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onAdd}
      title={meta.description}
      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] text-text-1 hover:bg-bg-3 hover:text-text-0 transition-colors text-left group cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <div className="w-[22px] h-[22px] rounded border border-border-default bg-bg-3 flex items-center justify-center text-[10px] shrink-0">
        <Icon size={12} />
      </div>
      <span className="flex-1">{meta.label}</span>
      <Plus size={11} className="text-text-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}

function ComponentsPanel() {
  const [search, setSearch] = useState('')
  const addBlock = useConfigStore((s) => s.addBlock)
  const selectBlock = useEditorStore((s) => s.selectBlock)

  const filtered = blockMetadata.filter((b) =>
    b.label.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = filtered.reduce<Record<string, typeof blockMetadata>>((acc, b) => {
    if (!acc[b.category]) acc[b.category] = []
    acc[b.category].push(b)
    return acc
  }, {})

  function handleAdd(type: BlockType) {
    const meta = blockMetadata.find((b) => b.type === type)
    if (!meta) return
    const block: BlockConfig = {
      id: newId('block'),
      type,
      variant: meta.variants[0],
      props: { ...meta.defaultProps },
    }
    addBlock(block)
    selectBlock(block.id)
    toast(`${meta.label} added`)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-3 pt-2.5 pb-1.5">
        <div className="relative">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-2 py-1.5 rounded-md border border-border-default bg-bg-2 text-text-0 text-[11px] outline-none focus:border-brand placeholder:text-text-3"
            style={{ paddingLeft: '1.625rem' }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <div className="text-[9px] font-semibold uppercase tracking-wider text-text-3 px-1.5 pt-2.5 pb-1">
              {category}
            </div>
            {items.map((meta) => (
              <WidgetItem
                key={meta.type}
                meta={meta}
                icon={blockIcons[meta.type] || Layout}
                onAdd={() => handleAdd(meta.type)}
              />
            ))}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-2 py-6 text-center text-[11px] text-text-3">
            No widget matches “{search}”
          </div>
        )}
      </div>
    </div>
  )
}

type Tab = 'pages' | 'layers' | 'components'

export function LeftSidebar() {
  const [tab, setTab] = useState<Tab>('pages')

  return (
    <div className="hidden md:flex w-[280px] bg-bg-1 border-r border-border-default flex-col shrink-0">
      <div className="flex border-b border-border-default shrink-0">
        {(
          [
            ['pages', 'Pages'],
            ['components', 'Widgets'],
            ['layers', 'Layers'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`flex-1 py-2 text-[11px] font-medium transition-colors ${
              tab === value
                ? 'text-text-0 border-b border-brand'
                : 'text-text-3 hover:text-text-1'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === 'pages' ? (
        <PagesPanel />
      ) : tab === 'layers' ? (
        <LayersPanel />
      ) : (
        <ComponentsPanel />
      )}
    </div>
  )
}
