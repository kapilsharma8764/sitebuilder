import { useState } from 'react'
import { Check, FileText, Home, Layout, PanelBottom, Pencil, Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { useConfigStore } from '@/store/configStore'
import { ensurePages, pathFromName } from '@/store/site-shape'
import type { SiteRegion } from '@/blocks/types'

/**
 * The site's structure: the shared header, the pages, and the shared footer.
 *
 * The header and footer are listed apart from the pages, and labelled as
 * appearing on every page, because that is the thing people get wrong about
 * this kind of builder — they expect to edit the logo once per page. It works
 * the way a PHP site does with one header include.
 */

function AddPageForm({ onDone }: { onDone: () => void }) {
  const addPage = useConfigStore((s) => s.addPage)
  const [name, setName] = useState('')
  const [showInMenu, setShowInMenu] = useState(true)

  function submit() {
    const trimmed = name.trim()
    if (!trimmed) return
    addPage(trimmed, showInMenu)
    toast(`${trimmed} added${showInMenu ? ' and put in the menu' : ''}`)
    onDone()
  }

  return (
    <div className="mx-2 mb-2 p-2 rounded-lg border border-border-default bg-bg-2">
      <input
        autoFocus
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') submit()
          if (event.key === 'Escape') onDone()
        }}
        placeholder="Page name"
        aria-label="Page name"
        className="w-full px-2 py-1.5 rounded border border-border-default bg-bg-3 text-text-0 text-[11.5px] outline-none focus:border-brand"
      />
      {/* Derived rather than asked for, so the name and the address cannot
          disagree. */}
      <p className="mt-1 text-[10px] text-text-3 font-mono">
        {name.trim() ? pathFromName(name) : '/page'}
      </p>

      <label className="mt-1.5 flex items-center gap-1.5 text-[10.5px] text-text-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={showInMenu}
          onChange={(event) => setShowInMenu(event.target.checked)}
          className="accent-brand"
        />
        Show in the menu
      </label>

      <div className="mt-2 flex gap-1.5">
        <button
          type="button"
          onClick={submit}
          disabled={!name.trim()}
          className="flex-1 py-1.5 rounded bg-brand text-white text-[11px] font-semibold hover:bg-brand-dim transition-colors disabled:opacity-30"
        >
          Add page
        </button>
        <button
          type="button"
          onClick={onDone}
          aria-label="Cancel"
          className="px-2 rounded border border-border-default text-text-3 hover:text-text-0 transition-colors"
        >
          <X size={11} />
        </button>
      </div>
    </div>
  )
}

function SharedRow({
  label,
  icon: Icon,
  region,
  count,
}: {
  label: string
  icon: typeof Layout
  region: SiteRegion
  count: number
}) {
  const activeRegion = useConfigStore((s) => s.activeRegion)
  const setActiveRegion = useConfigStore((s) => s.setActiveRegion)
  const active = activeRegion === region

  return (
    <button
      type="button"
      onClick={() => setActiveRegion(region)}
      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left transition-colors ${
        active ? 'bg-bg-3 text-text-0' : 'text-text-2 hover:bg-bg-2 hover:text-text-1'
      }`}
    >
      <Icon size={12} className="shrink-0" />
      <span className="text-[11.5px] flex-1 truncate">{label}</span>
      <span className="text-[10px] text-text-3">{count}</span>
    </button>
  )
}

export function PagesPanel() {
  const config = useConfigStore((s) => s.config)
  const activePageId = useConfigStore((s) => s.activePageId)
  const activeRegion = useConfigStore((s) => s.activeRegion)
  const setActivePage = useConfigStore((s) => s.setActivePage)
  const removePage = useConfigStore((s) => s.removePage)
  const renamePage = useConfigStore((s) => s.renamePage)
  const setPageInMenu = useConfigStore((s) => s.setPageInMenu)

  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')

  const pages = ensurePages(config)

  function commitRename(id: string) {
    const trimmed = draftName.trim()
    if (trimmed) renamePage(id, trimmed)
    setEditingId(null)
  }

  return (
    <div className="flex-1 overflow-y-auto py-2">
      <p className="px-3 pb-1 text-[10px] font-semibold tracking-wide uppercase text-text-3">
        On every page
      </p>
      <div className="px-1.5">
        <SharedRow label="Header" icon={Layout} region="header" count={config.header?.length ?? 0} />
        <SharedRow
          label="Footer"
          icon={PanelBottom}
          region="footer"
          count={config.footer?.length ?? 0}
        />
      </div>

      <div className="mt-3 px-3 pb-1 flex items-center justify-between">
        <p className="text-[10px] font-semibold tracking-wide uppercase text-text-3">Pages</p>
        <button
          type="button"
          onClick={() => setAdding(true)}
          aria-label="Add page"
          className="p-0.5 rounded text-text-3 hover:text-brand hover:bg-bg-2 transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>

      {adding && <AddPageForm onDone={() => setAdding(false)} />}

      <div className="px-1.5">
        {pages.map((page, index) => {
          const active = activeRegion === 'page' && activePageId === page.id
          const editing = editingId === page.id

          if (editing) {
            return (
              <div key={page.id} className="px-2.5 py-1.5">
                <input
                  autoFocus
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') commitRename(page.id)
                    if (event.key === 'Escape') setEditingId(null)
                  }}
                  onBlur={() => commitRename(page.id)}
                  aria-label={`Rename ${page.name}`}
                  className="w-full px-1.5 py-1 rounded border border-brand bg-bg-3 text-text-0 text-[11.5px] outline-none"
                />
              </div>
            )
          }

          return (
            <div
              key={page.id}
              className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors ${
                active ? 'bg-bg-3' : 'hover:bg-bg-2'
              }`}
            >
              <button
                type="button"
                onClick={() => setActivePage(page.id)}
                className="flex items-center gap-2 flex-1 min-w-0 text-left"
              >
                {index === 0 ? (
                  <Home size={12} className="shrink-0 text-text-3" />
                ) : (
                  <FileText size={12} className="shrink-0 text-text-3" />
                )}
                <span
                  className={`text-[11.5px] truncate ${active ? 'text-text-0' : 'text-text-2'}`}
                >
                  {page.name}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPageInMenu(page.id, page.showInMenu === false)}
                title={page.showInMenu === false ? 'Not in the menu' : 'Shown in the menu'}
                aria-label={
                  page.showInMenu === false
                    ? `Put ${page.name} in the menu`
                    : `Take ${page.name} out of the menu`
                }
                className={`p-0.5 rounded transition-colors ${
                  page.showInMenu === false
                    ? 'text-text-3 hover:text-text-1'
                    : 'text-brand hover:text-brand-dim'
                }`}
              >
                <Check size={11} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingId(page.id)
                  setDraftName(page.name)
                }}
                aria-label={`Rename ${page.name}`}
                className="p-0.5 rounded text-text-3 opacity-0 group-hover:opacity-100 hover:text-text-0 transition-all"
              >
                <Pencil size={10} />
              </button>

              {pages.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    removePage(page.id)
                    toast(`${page.name} removed`)
                  }}
                  aria-label={`Delete ${page.name}`}
                  className="p-0.5 rounded text-text-3 opacity-0 group-hover:opacity-100 hover:text-status-red transition-all"
                >
                  <Trash2 size={10} />
                </button>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-3 px-3 text-[10px] text-text-3 leading-relaxed">
        The header and footer are shared. Edit them once and every page changes.
      </p>
    </div>
  )
}
