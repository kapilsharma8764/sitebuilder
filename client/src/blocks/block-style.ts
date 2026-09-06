import type { BlockStyle } from './types'

/**
 * Turns a section's style settings into CSS.
 *
 * One function, used by the editor canvas and by the published HTML, so a
 * section cannot look one way while you are editing and another once it is
 * live. Anything left unset produces no CSS at all, which is what lets the
 * widget's own design show through untouched.
 */

const WIDTHS: Record<NonNullable<BlockStyle['width']>, string> = {
  full: '100%',
  centered: '1100px',
  narrow: '760px',
}

export function styleToCss(style: BlockStyle | undefined): Record<string, string> {
  if (!style) return {}
  const css: Record<string, string> = {}

  if (style.background) css.background = style.background
  if (style.backgroundImage) {
    css.backgroundImage = `url("${style.backgroundImage}")`
    css.backgroundSize = 'cover'
    css.backgroundPosition = 'center'
  }
  if (style.textColor) css.color = style.textColor
  if (style.textAlign) css.textAlign = style.textAlign
  if (style.paddingTop !== undefined) css.paddingTop = `${style.paddingTop}px`
  if (style.paddingBottom !== undefined) css.paddingBottom = `${style.paddingBottom}px`
  if (style.radius !== undefined) {
    css.borderRadius = `${style.radius}px`
    // Without this a background or image would spill past the rounded corner.
    css.overflow = 'hidden'
  }
  if (style.fontFamily) css.fontFamily = style.fontFamily
  if (style.fontScale !== undefined && style.fontScale !== 100) {
    // Scaling the root font size rather than each heading keeps the widget's
    // own proportions intact while making the whole section bigger or smaller.
    css.fontSize = `${style.fontScale}%`
  }

  return css
}

/** Styles for the inner wrapper that constrains how wide the content runs. */
export function widthCss(style: BlockStyle | undefined): Record<string, string> {
  const width = style?.width
  if (!width || width === 'full') return {}
  return { maxWidth: WIDTHS[width], marginLeft: 'auto', marginRight: 'auto' }
}

/** True when the section has nothing set and needs no wrapper at all. */
export function isEmptyStyle(style: BlockStyle | undefined): boolean {
  if (!style) return true
  return Object.values(style).every((value) => value === undefined || value === '')
}

/** CSS text for the published file, where React style objects are no use. */
export function styleToCssText(style: BlockStyle | undefined): string {
  const merged = { ...styleToCss(style), ...widthCss(style) }
  return Object.entries(merged)
    .map(([property, value]) => `${property.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${value}`)
    .join(';')
}
