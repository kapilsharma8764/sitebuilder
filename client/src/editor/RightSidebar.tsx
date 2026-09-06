import { useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { useConfigStore } from '@/store/configStore'
import { PropertiesPanel } from '@/builder/PropertiesPanel'
import { DesignPanel } from './DesignPanel'

type Tab = 'properties' | 'design'

export function RightSidebar() {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId)
  const blocks = useConfigStore((s) => {
    const pages = s.config.pages
    if (!pages || pages.length === 0) return s.config.blocks
    const page = pages.find((p) => p.id === s.activePageId) ?? pages[0]
    return page.blocks
  })
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId)
  const [tab, setTab] = useState<Tab>('properties')

  // Selecting a block should bring its Properties forward, even if the user
  // was last looking at Design. Adjusting state during render (rather than in
  // an effect) applies the switch in the same pass, so the panel never paints
  // the wrong tab for a frame.
  const [lastSelectedId, setLastSelectedId] = useState(selectedBlockId)
  if (selectedBlockId !== lastSelectedId) {
    setLastSelectedId(selectedBlockId)
    if (selectedBlockId) setTab('properties')
  }

  const activeTab = tab

  return (
    <div className="hidden md:flex w-[280px] bg-bg-1 border-l border-border-default flex-col shrink-0">
      {/* Tabs */}
      <div className="flex border-b border-border-default shrink-0">
        <button
          onClick={() => setTab('properties')}
          className={`flex-1 py-2 text-[11px] font-medium transition-colors ${
            activeTab === 'properties'
              ? 'text-text-0 border-b border-brand'
              : 'text-text-3 hover:text-text-1'
          }`}
        >
          Properties
        </button>
        <button
          onClick={() => setTab('design')}
          className={`flex-1 py-2 text-[11px] font-medium transition-colors ${
            activeTab === 'design'
              ? 'text-text-0 border-b border-brand'
              : 'text-text-3 hover:text-text-1'
          }`}
        >
          Design
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'design' ? (
          <div className="flex-1 overflow-y-auto">
            <DesignPanel />
          </div>
        ) : (
          <PropertiesPanel block={selectedBlock} />
        )}
      </div>
    </div>
  )
}
