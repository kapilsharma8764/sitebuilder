import { useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { useConfigStore } from '@/store/configStore'
import { PropertiesPanel } from '@/builder/PropertiesPanel'
import { StylePanel } from '@/builder/StylePanel'
import { regionBlocks, regionOfBlock } from '@/store/site-shape'
import { DesignPanel } from './DesignPanel'

type Tab = 'content' | 'style' | 'design'

export function RightSidebar() {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId)
  // The selected block may be in the header or footer rather than the page.
  const selectedBlock = useConfigStore((s) => {
    if (!selectedBlockId) return undefined
    const region = regionOfBlock(s.config, selectedBlockId, s.activePageId)
    return regionBlocks(s.config, region, s.activePageId).find((b) => b.id === selectedBlockId)
  })
  const [tab, setTab] = useState<Tab>('content')

  // Selecting a block should bring its Properties forward, even if the user
  // was last looking at Design. Adjusting state during render (rather than in
  // an effect) applies the switch in the same pass, so the panel never paints
  // the wrong tab for a frame.
  const [lastSelectedId, setLastSelectedId] = useState(selectedBlockId)
  if (selectedBlockId !== lastSelectedId) {
    setLastSelectedId(selectedBlockId)
    // Keep Style selected if that is where the user was working; jumping back
    // to Content on every click would fight anyone restyling several sections.
    if (selectedBlockId && tab === 'design') setTab('content')
  }

  const activeTab = tab

  return (
    <div className="hidden md:flex w-[280px] bg-bg-1 border-l border-border-default flex-col shrink-0">
      {/* Tabs */}
      <div className="flex border-b border-border-default shrink-0">
        {(
          [
            ['content', 'Content'],
            ['style', 'Style'],
            ['design', 'Site'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`flex-1 py-2 text-[11px] font-medium transition-colors ${
              activeTab === value
                ? 'text-text-0 border-b border-brand'
                : 'text-text-3 hover:text-text-1'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'design' ? (
          <div className="flex-1 overflow-y-auto">
            <DesignPanel />
          </div>
        ) : activeTab === 'style' ? (
          <StylePanel block={selectedBlock} />
        ) : (
          <PropertiesPanel block={selectedBlock} />
        )}
      </div>
    </div>
  )
}
