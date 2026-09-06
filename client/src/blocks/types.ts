export type BlockType =
  | 'navbar'
  | 'hero'
  | 'features'
  | 'pricing'
  | 'cta'
  | 'footer'
  | 'testimonials'
  | 'stats'
  | 'faq'
  | 'team'
  | 'contact'
  | 'newsletter'
  | 'logocloud'
  | 'divider'
  | 'banner'
  | 'content'
  | 'image'
  | 'video'
  | 'gallery'

export type BlockVariant = string

export interface BlockConfig {
  id: string
  type: BlockType
  variant: BlockVariant
  props: Record<string, unknown>
}

export interface ThemeConfig {
  // Backgrounds
  bg0: string
  bg1: string
  bg2: string
  bg3: string
  bg4: string
  bg5: string
  // Text
  text0: string
  text1: string
  text2: string
  text3: string
  // Accent
  accent: string
  accentDim: string
  // Borders
  borderDefault: string
  borderSubtle: string
  borderHover: string
  // Fonts
  fontSans: string
  fontDisplay: string
  fontMono: string
  // Radius
  radius: number
  radiusLg: number
}

export interface PageConfig {
  id: string
  name: string
  path: string
  blocks: BlockConfig[]
  /** Whether this page appears in the site's navigation. Defaults to true. */
  showInMenu?: boolean
}

export interface SiteConfig {
  name: string
  /**
   * Drawn above every page. Held here rather than inside each page for the same
   * reason a PHP site keeps one header.php: edit the logo once and it changes
   * everywhere, instead of once per page and eventually inconsistently.
   */
  header?: BlockConfig[]
  pages?: PageConfig[]
  /** The active page's blocks, mirrored for anything that predates pages. */
  blocks: BlockConfig[]
  /** Drawn below every page. */
  footer?: BlockConfig[]
  theme?: Partial<ThemeConfig>
}

/** Which part of the site the editor is currently working on. */
export type SiteRegion = 'header' | 'page' | 'footer'
