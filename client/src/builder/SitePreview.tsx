import { useMemo } from 'react'
import type { BlockConfig, ThemeConfig } from '@/blocks/types'
import { RenderBlock } from '@/blocks/registry'
import { resolveTheme, themeToCSS } from '@/lib/theme-presets'

/**
 * A small live picture of a site.
 *
 * The real blocks, drawn at a fraction of their size, rather than a screenshot
 * taken at publish time. A screenshot would go stale the moment the site is
 * edited, and would need capturing, storing and serving; this cannot drift
 * because it is the same renderer that draws the canvas.
 */
export function SitePreview({
  theme,
  blocks,
  scale = 0.26,
  width = 1100,
}: {
  theme?: Partial<ThemeConfig> | null
  blocks: BlockConfig[]
  scale?: number
  width?: number
}) {
  const cssVars = useMemo(() => themeToCSS(resolveTheme(theme ?? undefined)), [theme])

  if (blocks.length === 0) {
    return <div className="absolute inset-0 bg-bg-2" aria-hidden="true" />
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg-0">
      <div
        // `scroll-revealed` because the widgets fade their content in as it
        // scrolls into view, and a still thumbnail never scrolls — without it
        // every heading and button sits at opacity zero and the card looks
        // blank.
        className="@container scroll-revealed absolute top-0 left-0 origin-top-left pointer-events-none select-none"
        style={{
          width: `${width}px`,
          transform: `scale(${scale})`,
          ...cssVars,
          color: 'var(--color-text-0)',
          backgroundColor: 'var(--color-bg-1)',
        }}
        aria-hidden="true"
      >
        {blocks.map((block) => (
          <RenderBlock key={block.id} block={block} />
        ))}
      </div>
    </div>
  )
}
