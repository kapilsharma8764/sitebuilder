import type { BlockType, SiteRegion } from '@/blocks/types'

/**
 * What is being dragged, and where it can land.
 *
 * Two things get dragged in this editor: a widget from the library, which
 * becomes a new section, and a section already on the page, which moves. Both
 * land in the same places, so they share one set of drop targets and one
 * handler.
 */

export interface NewWidgetDrag {
  kind: 'new'
  type: BlockType
}

export interface MoveSectionDrag {
  kind: 'move'
  id: string
  region: SiteRegion
  index: number
}

export type DragPayload = NewWidgetDrag | MoveSectionDrag

/** A gap between two sections — where a drop inserts. */
export interface DropTarget {
  kind: 'gap'
  region: SiteRegion
  /** Index the dragged section takes after the drop. */
  index: number
}

export function isDragPayload(data: unknown): data is DragPayload {
  if (!data || typeof data !== 'object') return false
  const kind = (data as { kind?: unknown }).kind
  return kind === 'new' || kind === 'move'
}

export function isDropTarget(data: unknown): data is DropTarget {
  return Boolean(data) && (data as { kind?: unknown }).kind === 'gap'
}

/**
 * Where a moved section ends up.
 *
 * Removing it before inserting shifts every later gap down by one, so a
 * section dragged downwards would land one place short. Adjusting for that
 * here keeps the maths in one place instead of in the drop handler.
 */
export function resolveMoveIndex(from: number, gap: number): number {
  return gap > from ? gap - 1 : gap
}
