import { useDroppable } from '@dnd-kit/core'
import type { SiteRegion } from '@/blocks/types'

/**
 * Half a section, as a landing place.
 *
 * Each section gets two of these while a drag is in progress — its top half
 * drops above it, its bottom half below. Aiming at a full half-section is
 * something you can do on a trackpad; aiming at an eighteen-pixel strip
 * between sections, which is what this replaces, is not.
 *
 * They only exist during a drag, so nothing sits on top of the page the rest
 * of the time.
 */
export function DropZone({
  region,
  index,
  edge,
}: {
  region: SiteRegion
  /** Where a drop here inserts the section. */
  index: number
  edge: 'top' | 'bottom'
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${region}-${edge}-${index}`,
    data: { kind: 'gap', region, index },
  })

  return (
    <div
      ref={setNodeRef}
      className={`absolute inset-x-0 ${edge === 'top' ? 'top-0' : 'bottom-0'} h-1/2 z-[3]`}
      aria-hidden="true"
    >
      {isOver && (
        <>
          <div
            className={`absolute inset-x-3 h-1 rounded-full bg-brand ${
              edge === 'top' ? 'top-0' : 'bottom-0'
            }`}
          />
          <span
            className={`absolute left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-brand text-white text-[10px] font-medium whitespace-nowrap ${
              edge === 'top' ? 'top-1' : 'bottom-1'
            }`}
          >
            Drop here
          </span>
        </>
      )}
    </div>
  )
}

/** The landing place after the last section, and the whole of an empty region. */
export function DropEnd({ region, index }: { region: SiteRegion; index: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${region}-end-${index}`,
    data: { kind: 'gap', region, index },
  })

  return (
    <div
      ref={setNodeRef}
      className="relative z-[3] transition-all"
      style={{ height: isOver ? 64 : 40 }}
      aria-hidden="true"
    >
      <div
        className={`absolute inset-x-3 top-1/2 -translate-y-1/2 rounded-full transition-all ${
          isOver ? 'h-1 bg-brand' : 'h-px bg-brand/25'
        }`}
      />
      {isOver && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full bg-brand text-white text-[10px] font-medium whitespace-nowrap">
          Drop here
        </span>
      )}
    </div>
  )
}
