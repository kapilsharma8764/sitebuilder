import { useState, type ReactNode } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { toast } from 'sonner'
import { useConfigStore } from '@/store/configStore'
import { blockMetadata } from '@/lib/block-metadata'
import { newId } from '@/lib/id'
import type { BlockConfig } from '@/blocks/types'
import { isDragPayload, isDropTarget, resolveMoveIndex, type DragPayload } from './dnd'

/**
 * Drag and drop across the whole editor.
 *
 * One context wraps the widget library and the canvas, which is what lets a
 * widget be dragged out of the list and dropped onto the page — the thing
 * people expect of a builder and the reason this is not simply a sortable list
 * inside the canvas.
 */

function label(payload: DragPayload | null): string {
  if (!payload) return ''
  if (payload.kind === 'new') {
    return blockMetadata.find((meta) => meta.type === payload.type)?.label ?? payload.type
  }
  return 'Move section'
}

export function BuilderDndContext({ children }: { children: ReactNode }) {
  const addBlock = useConfigStore((s) => s.addBlock)
  const moveBlock = useConfigStore((s) => s.moveBlock)
  const setActiveRegion = useConfigStore((s) => s.setActiveRegion)

  const [dragging, setDragging] = useState<DragPayload | null>(null)

  const sensors = useSensors(
    // A few pixels of movement before a drag starts, so clicking a widget to
    // select it does not turn into an accidental drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  )

  function handleStart(event: DragStartEvent) {
    const data = event.active.data.current
    setDragging(isDragPayload(data) ? data : null)
  }

  function handleEnd(event: DragEndEvent) {
    const payload = dragging
    setDragging(null)
    if (!payload) return

    const target = event.over?.data.current
    if (!isDropTarget(target)) return

    if (payload.kind === 'new') {
      const meta = blockMetadata.find((m) => m.type === payload.type)
      if (!meta) return

      const block: BlockConfig = {
        id: newId(`block-${payload.type}`),
        type: payload.type,
        variant: meta.variants[0],
        props: { ...meta.defaultProps },
      }

      // Adding goes to the active region, so point that at where it landed.
      setActiveRegion(target.region)
      addBlock(block, target.index)
      toast(`${meta.label} added`)
      return
    }

    if (payload.region !== target.region) {
      // Moving between the page and the shared header or footer would change
      // what appears on other pages, which is not what a drag looks like it
      // does. Say so rather than doing it silently.
      toast('Sections cannot be dragged between the page and the header or footer')
      return
    }

    const to = resolveMoveIndex(payload.index, target.index)
    if (to === payload.index) return
    setActiveRegion(payload.region)
    moveBlock(payload.index, to)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleStart}
      onDragEnd={handleEnd}
      onDragCancel={() => setDragging(null)}
    >
      {children}

      <DragOverlay dropAnimation={null}>
        {dragging && (
          <div className="px-3 py-1.5 rounded-lg bg-brand text-white text-[11.5px] font-medium shadow-lg pointer-events-none">
            {label(dragging)}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
