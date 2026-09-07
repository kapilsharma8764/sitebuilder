import { type ReactNode, useRef, useEffect } from 'react'
import { Copy, Trash2, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { toast } from 'sonner'
import { useConfigStore } from '@/store/configStore'
import { regionBlocks, regionOfBlock } from '@/store/site-shape'
import { editableTarget, readPath, writePath } from './inline-edit'
import { useEditorStore } from '@/store/editorStore'
import { useScrollReveal } from '@/lib/useScrollReveal'
import type { BlockConfig, SiteRegion } from './types'

interface Props {
  block: BlockConfig
  /** Position within its region, needed when the section is dragged. */
  index: number
  region: SiteRegion
  isSelected: boolean
  onSelect: () => void
  children: ReactNode
}

export function BlockWrapper({ block, index, region, isSelected, onSelect, children }: Props) {
  // The up/down controls need to know how long the list this block sits in is,
  // and that list may be the header, the page or the footer.
  const blocks = useConfigStore((s) =>
    regionBlocks(s.config, regionOfBlock(s.config, block.id, s.activePageId), s.activePageId),
  )
  const { duplicateBlock, removeBlock, moveBlock } = useConfigStore()
  const { selectedBlockId, selectBlock } = useEditorStore()
  const previewMode = useEditorStore((s) => s.previewMode)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { ref: revealRef, isRevealed } = useScrollReveal(!previewMode)

  // Only the handle starts a drag, so clicking anywhere on a section still
  // selects it and text inside stays selectable.
  const { attributes, listeners, setActivatorNodeRef, isDragging } = useDraggable({
    id: `section-${block.id}`,
    data: { kind: 'move', id: block.id, region, index },
  })

  const isFirst = index === 0
  const isLast = index === blocks.length - 1

  useEffect(() => {
    if (isSelected && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [isSelected])


  // ── Editing text on the page ───────────────────────────────────────────
  // Double-click a piece of text a widget has marked as editable and type
  // straight into it. Hunting for the right box in the side panel every time
  // you want to change a word is the difference between a builder that feels
  // direct and one that feels like filling in a form.
  const updateBlockProps = useConfigStore((s) => s.updateBlockProps)

  function startEditing(event: React.MouseEvent) {
    if (previewMode) return
    const target = editableTarget(event.target)
    if (!target) return

    const path = target.dataset.edit
    if (!path) return

    event.stopPropagation()
    event.preventDefault()

    const before = String(readPath(block.props, path) ?? '')

    target.contentEditable = 'plaintext-only'
    target.spellcheck = false
    target.focus()

    // Put the cursor where they clicked rather than at the start.
    const selection = window.getSelection()
    if (selection && selection.rangeCount === 0) {
      const range = document.createRange()
      range.selectNodeContents(target)
      range.collapse(false)
      selection.addRange(range)
    }

    const finish = () => {
      target.removeEventListener('blur', finish)
      target.removeEventListener('keydown', onKey)
      target.contentEditable = 'false'

      const after = (target.textContent ?? '').trim()
      // Only touch the store when something actually changed, so a stray
      // double-click does not fill the undo history with no-ops.
      if (after !== before) {
        updateBlockProps(block.id, writePath(block.props, path, after))
      } else {
        // React did not re-render, so put back exactly what was there.
        target.textContent = before
      }
    }

    const onKey = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === 'Escape') {
        keyEvent.preventDefault()
        target.textContent = before
        target.blur()
      }
      // Enter commits on a single-line field; Shift+Enter always adds a line.
      if (keyEvent.key === 'Enter' && !keyEvent.shiftKey && target.tagName !== 'P') {
        keyEvent.preventDefault()
        target.blur()
      }
    }

    target.addEventListener('blur', finish)
    target.addEventListener('keydown', onKey)
  }

  if (previewMode) {
    return (
      <div
        ref={revealRef}
        className={isRevealed ? 'scroll-revealed' : ''}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      ref={(el) => {
        (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el
        ;(revealRef as React.MutableRefObject<HTMLDivElement | null>).current = el
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onDoubleClick={startEditing}
      className={`scroll-revealed relative cursor-pointer border-b border-border-subtle group transition-[opacity,transform] duration-500 ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${
        isSelected
          ? 'bg-brand-glow2 outline outline-2 outline-brand -outline-offset-2 rounded animate-select-pulse'
          : 'hover:bg-brand-glow2'
      }`}
      role="button"
      aria-label={`${block.type} block${isSelected ? ', selected' : ''}`}
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        // Enter and space select the section — but not while someone is
        // typing into it, where space is a space and swallowing it makes the
        // text come out as one long word.
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isDragging ? 0.4 : undefined,
      }}
    >
      {/* Block type tag */}
      <span
        className={`absolute top-1.5 left-1.5 text-[9px] font-semibold uppercase tracking-wider text-brand bg-brand-glow px-1.5 py-0.5 rounded transition-opacity z-10 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        {block.type}
      </span>

      {/* Typing straight onto the page is not discoverable on its own, so the
          selected section says so once. */}
      {isSelected && (
        <span className="absolute bottom-1.5 left-1.5 text-[9px] text-text-3 bg-bg-1/85 px-1.5 py-0.5 rounded z-10 pointer-events-none">
          Double-click text to edit it
        </span>
      )}

      {/* Action buttons */}
      <div
        className={`absolute top-1.5 right-1.5 flex gap-0.5 z-10 transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <button
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          onClick={(e) => e.stopPropagation()}
          className="w-6 h-6 rounded bg-bg-2/80 border border-border-default backdrop-blur-sm flex items-center justify-center text-text-3 hover:text-text-0 hover:bg-bg-3 transition-colors cursor-grab active:cursor-grabbing"
          title="Drag to move"
          aria-label={`Drag ${block.type} section to move it`}
        >
          <GripVertical size={12} />
        </button>
        {!isFirst && (
          <button
            onClick={(e) => { e.stopPropagation(); moveBlock(index, index - 1) }}
            className="w-6 h-6 rounded bg-bg-2/80 border border-border-default backdrop-blur-sm flex items-center justify-center text-text-3 hover:text-text-0 hover:bg-bg-3 transition-colors"
            title="Move up"
            aria-label={`Move ${block.type} block up`}
          >
            <ChevronUp size={12} />
          </button>
        )}
        {!isLast && (
          <button
            onClick={(e) => { e.stopPropagation(); moveBlock(index, index + 1) }}
            className="w-6 h-6 rounded bg-bg-2/80 border border-border-default backdrop-blur-sm flex items-center justify-center text-text-3 hover:text-text-0 hover:bg-bg-3 transition-colors"
            title="Move down"
            aria-label={`Move ${block.type} block down`}
          >
            <ChevronDown size={12} />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id) }}
          className="w-6 h-6 rounded bg-bg-2/80 border border-border-default backdrop-blur-sm flex items-center justify-center text-text-3 hover:text-text-0 hover:bg-bg-3 transition-colors"
          title="Duplicate"
          aria-label={`Duplicate ${block.type} block`}
        >
          <Copy size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (selectedBlockId === block.id) selectBlock(null)
            removeBlock(block.id)
            toast('Block removed', {
              action: {
                label: 'Undo',
                onClick: () => {
                  useConfigStore.getState().undo()
                  toast('Block restored')
                },
              },
              duration: 3000,
            })
          }}
          className="w-6 h-6 rounded bg-bg-2/80 border border-border-default backdrop-blur-sm flex items-center justify-center text-text-3 hover:text-status-red hover:bg-status-red/10 transition-colors"
          title="Delete"
          aria-label={`Delete ${block.type} block`}
        >
          <Trash2 size={12} />
        </button>
      </div>

      {children}
    </div>
  )
}
