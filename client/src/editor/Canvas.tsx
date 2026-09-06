import { useMemo } from 'react'
import { useDndMonitor } from '@dnd-kit/core'
import { useState } from 'react'
import { useConfigStore } from '@/store/configStore'
import type { SiteRegion } from '@/blocks/types'
import { DropGap } from '@/builder/DropGap'
import { useEditorStore } from '@/store/editorStore'
import { CanvasEmpty } from './CanvasEmpty'
import { BlockWrapper } from '@/blocks/BlockWrapper'
import { RenderBlock } from '@/blocks/registry'
import { resolveTheme, themeToCSS } from '@/lib/theme-presets'
import { useGoogleFonts } from '@/lib/useGoogleFonts'

/**
 * A labelled strip around the header and footer, so it is obvious those parts
 * are shared and that editing them changes every page.
 */
function SharedRegion({
  label,
  active,
  onActivate,
  children,
}: {
  label: string
  active: boolean
  onActivate: () => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onActivate}
        className={`absolute -top-px left-0 z-[3] px-1.5 py-0.5 rounded-br text-[9px] font-medium tracking-wide uppercase transition-colors ${
          active ? 'bg-brand text-white' : 'bg-bg-4 text-text-2 hover:bg-bg-5'
        }`}
        title={`${label} appears on every page`}
      >
        {label} · every page
      </button>
      {children}
    </div>
  )
}

export function Canvas() {
  const header = useConfigStore((s) => s.config.header ?? [])
  const footer = useConfigStore((s) => s.config.footer ?? [])
  const activeRegion = useConfigStore((s) => s.activeRegion)
  const setActiveRegion = useConfigStore((s) => s.setActiveRegion)
  const blocks = useConfigStore((s) => {
    const pages = s.config.pages
    if (!pages || pages.length === 0) return s.config.blocks
    const page = pages.find((p) => p.id === s.activePageId) ?? pages[0]
    return page.blocks
  })
  const theme = useConfigStore((s) => s.config.theme)
  const { selectedBlockId, selectBlock, viewport } = useEditorStore()

  // Drop gaps only take up space while something is actually being dragged.
  const [dragging, setDragging] = useState(false)
  useDndMonitor({
    onDragStart: () => setDragging(true),
    onDragEnd: () => setDragging(false),
    onDragCancel: () => setDragging(false),
  })

  const resolved = useMemo(() => resolveTheme(theme), [theme])
  const cssVars = useMemo(() => themeToCSS(resolved), [resolved])
  useGoogleFonts([resolved.fontSans, resolved.fontDisplay, resolved.fontMono])

  const maxWidth = viewport === 'desktop' ? '880px' : viewport === 'tablet' ? '768px' : '375px'

  const isEmpty = blocks.length === 0 && header.length === 0 && footer.length === 0
  if (isEmpty) {
    return <CanvasEmpty />
  }

  // Selecting a block also switches the active region, so the next widget you
  // add lands beside the one you just clicked rather than on the page below.
  const renderRegion = (list: typeof blocks, region: SiteRegion) => (
    <>
      {list.map((block, index) => (
        <div key={block.id}>
          <DropGap region={region} index={index} active={dragging} />
          <BlockWrapper
            block={block}
            index={index}
            region={region}
            isSelected={selectedBlockId === block.id}
            onSelect={() => {
              selectBlock(block.id)
              setActiveRegion(region)
            }}
          >
            <RenderBlock block={block} />
          </BlockWrapper>
        </div>
      ))}
      {/* The gap after the last section, so something can be dropped at the
          end of a region. */}
      <DropGap region={region} index={list.length} active={dragging} />
    </>
  )

  const canvasContent = (
    <div
      className="@container border rounded-xl min-h-[400px] relative z-[1] overflow-hidden transition-all duration-300"
      style={{ width: '100%', maxWidth, ...cssVars, color: 'var(--color-text-0)', backgroundColor: 'var(--color-bg-1)', borderColor: 'var(--color-border-default)' } as React.CSSProperties}
      onClick={(e) => {
        if (e.target === e.currentTarget) selectBlock(null)
      }}
      role="region"
      aria-label={`Site preview, ${blocks.length} blocks, ${viewport} viewport`}
    >
      {header.length > 0 && (
        <SharedRegion
          label="Header"
          active={activeRegion === 'header'}
          onActivate={() => setActiveRegion('header')}
        >
          {renderRegion(header, 'header')}
        </SharedRegion>
      )}

      <div onClick={() => setActiveRegion('page')}>{renderRegion(blocks, 'page')}</div>

      {footer.length > 0 && (
        <SharedRegion
          label="Footer"
          active={activeRegion === 'footer'}
          onActivate={() => setActiveRegion('footer')}
        >
          {renderRegion(footer, 'footer')}
        </SharedRegion>
      )}
    </div>
  )

  return (
    <div className="flex-1 flex items-start justify-center p-6 overflow-auto relative">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-bg-3) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {viewport === 'tablet' ? (
        <div className="relative z-[1]">
          {/* Tablet frame */}
          <div className="border-[12px] border-bg-4 rounded-2xl bg-bg-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="rounded-lg overflow-hidden">
              {canvasContent}
            </div>
          </div>
        </div>
      ) : viewport === 'mobile' ? (
        <div className="relative z-[1]">
          {/* Phone frame */}
          <div className="border-[10px] border-bg-4 rounded-[2rem] bg-bg-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            {/* Notch */}
            <div className="flex justify-center -mt-[4px] mb-1">
              <div className="w-24 h-5 bg-bg-4 rounded-b-xl" />
            </div>
            <div className="rounded-xl overflow-hidden">
              {canvasContent}
            </div>
            {/* Home indicator */}
            <div className="flex justify-center mt-2 pb-1">
              <div className="w-28 h-1 bg-bg-5 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        canvasContent
      )}
    </div>
  )
}
