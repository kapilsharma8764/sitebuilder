import { useDroppable } from '@dnd-kit/core'
import type { SiteRegion } from '@/blocks/types'

/**
 * The landing strip between two sections.
 *
 * Invisible until something is being dragged, then it lights up as a line
 * where the section will go. Without a visible target a drop is guesswork —
 * this is most of what makes drag and drop feel like it works.
 */
export function DropGap({
  region,
  index,
  active,
}: {
  region: SiteRegion
  index: number
  /** True while any drag is in progress, so gaps only take space then. */
  active: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${region}-gap-${index}`,
    data: { kind: 'gap', region, index },
  })

  if (!active) return null

  return (
    <div
      ref={setNodeRef}
      className="relative z-[2]"
      // Tall enough to be an easy target while dragging, and gone otherwise so
      // the page is not full of gaps.
      style={{ height: isOver ? 40 : 18, transition: 'height 120ms ease' }}
      aria-hidden="true"
    >
      <div
        className={`absolute left-4 right-4 top-1/2 -translate-y-1/2 rounded-full transition-all ${
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
