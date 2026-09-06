import type { BlockType } from '@/blocks/types'

/**
 * The orders in which sections are stacked.
 *
 * Looking at a large number of professional templates, the section list barely
 * varies — header, headline, numbers, photo, cards, reviews, footer. What
 * changes is the order and which ones are present. Five orders are enough to
 * make ten style sets feel like forty distinct designs.
 */

export interface Section {
  type: BlockType
  variant: string
  /** Which part of the content pack fills this section. */
  role:
    | 'nav'
    | 'hero'
    | 'stats'
    | 'about'
    | 'services'
    | 'photo'
    | 'gallery'
    | 'reviews'
    | 'faq'
    | 'cta'
    | 'contact'
    | 'map'
    | 'whatsapp'
    | 'footer'
    | 'banner'
}

export interface Arrangement {
  id: string
  name: string
  sections: Section[]
}

export const arrangements: Arrangement[] = [
  {
    id: 'landing',
    name: 'Landing',
    sections: [
      { type: 'navbar', variant: 'default', role: 'nav' },
      { type: 'hero', variant: 'centered', role: 'hero' },
      { type: 'stats', variant: 'bar', role: 'stats' },
      { type: 'image', variant: 'hero-image', role: 'photo' },
      { type: 'features', variant: 'grid', role: 'services' },
      { type: 'testimonials', variant: 'cards', role: 'reviews' },
      { type: 'cta', variant: 'simple', role: 'cta' },
      { type: 'footer', variant: 'simple', role: 'footer' },
    ],
  },
  {
    id: 'showcase',
    name: 'Showcase',
    sections: [
      { type: 'navbar', variant: 'centered', role: 'nav' },
      { type: 'hero', variant: 'photo', role: 'hero' },
      { type: 'image', variant: 'side-by-side', role: 'photo' },
      { type: 'content', variant: 'prose', role: 'about' },
      { type: 'gallery', variant: 'grid', role: 'gallery' },
      { type: 'stats', variant: 'grid', role: 'stats' },
      { type: 'testimonials', variant: 'spotlight', role: 'reviews' },
      { type: 'contact', variant: 'form', role: 'contact' },
      { type: 'footer', variant: 'multi-column', role: 'footer' },
      { type: 'whatsapp', variant: 'floating', role: 'whatsapp' },
    ],
  },
  {
    id: 'service',
    name: 'Service',
    sections: [
      { type: 'navbar', variant: 'default', role: 'nav' },
      { type: 'hero', variant: 'split', role: 'hero' },
      { type: 'features', variant: 'list', role: 'services' },
      { type: 'stats', variant: 'counter', role: 'stats' },
      { type: 'image', variant: 'hero-image', role: 'photo' },
      { type: 'testimonials', variant: 'cards', role: 'reviews' },
      { type: 'faq', variant: 'accordion', role: 'faq' },
      { type: 'contact', variant: 'form', role: 'contact' },
      { type: 'map', variant: 'side-by-side', role: 'map' },
      { type: 'footer', variant: 'simple', role: 'footer' },
      { type: 'whatsapp', variant: 'floating', role: 'whatsapp' },
    ],
  },
  {
    id: 'storefront',
    name: 'Storefront',
    sections: [
      { type: 'banner', variant: 'bar', role: 'banner' },
      { type: 'navbar', variant: 'default', role: 'nav' },
      { type: 'hero', variant: 'photo', role: 'hero' },
      { type: 'gallery', variant: 'masonry', role: 'gallery' },
      { type: 'content', variant: 'highlight', role: 'about' },
      { type: 'features', variant: 'alternating', role: 'services' },
      { type: 'stats', variant: 'bar', role: 'stats' },
      { type: 'contact', variant: 'form', role: 'contact' },
      { type: 'map', variant: 'full', role: 'map' },
      { type: 'footer', variant: 'minimal', role: 'footer' },
      { type: 'whatsapp', variant: 'floating', role: 'whatsapp' },
    ],
  },
  {
    id: 'product',
    name: 'Product',
    sections: [
      { type: 'navbar', variant: 'default', role: 'nav' },
      { type: 'hero', variant: 'centered', role: 'hero' },
      { type: 'stats', variant: 'bar', role: 'stats' },
      { type: 'features', variant: 'grid', role: 'services' },
      { type: 'image', variant: 'hero-image', role: 'photo' },
      { type: 'testimonials', variant: 'carousel', role: 'reviews' },
      { type: 'faq', variant: 'accordion', role: 'faq' },
      { type: 'cta', variant: 'split', role: 'cta' },
      { type: 'footer', variant: 'multi-column', role: 'footer' },
    ],
  },
]

export function arrangementById(id: string): Arrangement {
  return arrangements.find((a) => a.id === id) ?? arrangements[0]
}
