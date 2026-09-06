import type { BlockConfig, SiteConfig } from '@/blocks/types'
import { newId } from '@/lib/id'
import { arrangementById, type Section } from './arrangements'
import { packById, type ContentPack } from './content'
import { photo, photos } from './photos'
import { styleById } from './styles'

/**
 * Turns a template definition into a site.
 *
 * A template is three choices — which words (content pack), which look (style
 * set) and which order (arrangement) — and this assembles them. Because the
 * result is an ordinary site config, every template is fully editable the
 * moment it opens; nothing is baked in that the editor cannot reach.
 */

function propsFor(section: Section, pack: ContentPack): Record<string, unknown> {
  const gallery = pack.photos.map((name) => ({
    src: photo(photos[name], 900),
    alt: `${pack.name} — ${pack.galleryTitle.toLowerCase()}`,
    caption: '',
  }))

  switch (section.role) {
    case 'nav':
      return { logo: pack.name, links: pack.menu, ctaText: pack.cta }

    case 'hero':
      return {
        badge: pack.label,
        headline: pack.headline,
        subheadline: pack.slogan,
        primaryCta: pack.cta,
        secondaryCta: pack.secondaryCta,
        // The trade's own photograph, which is most of what makes a template
        // look like a finished site rather than a wireframe.
        image: gallery[0]?.src ?? '',
      }

    case 'stats':
      return { title: 'By the numbers', items: pack.stats }

    case 'about':
      return { body: pack.about }

    case 'services':
      return {
        title: pack.servicesTitle,
        subtitle: pack.slogan,
        items: pack.services,
      }

    case 'photo': {
      const first = gallery[0]
      return {
        src: first?.src ?? '',
        alt: first?.alt ?? '',
        title: pack.servicesTitle,
        subtitle: pack.slogan,
        imageSide: 'left',
      }
    }

    case 'gallery':
      return { title: pack.galleryTitle, images: gallery }

    case 'reviews':
      return { title: pack.reviewsTitle, items: pack.reviews }

    case 'faq':
      return { title: 'Common questions', items: pack.faq }

    case 'cta':
      return {
        headline: pack.contactTitle,
        subheadline: pack.contactSubtitle,
        buttonText: pack.cta,
      }

    case 'contact':
      return { title: pack.contactTitle, subtitle: pack.contactSubtitle }

    case 'map':
      return {
        title: 'Find us',
        address: '',
        mapUrl: '',
        timing: '',
        height: 360,
      }

    case 'whatsapp':
      // Filled in from the Create Website form; empty here so a template never
      // publishes a stranger's phone number.
      return {
        number: '',
        countryCode: '91',
        label: 'Chat with us',
        message: `Hello ${pack.name}, I would like to know more.`,
        side: 'right',
      }

    case 'banner':
      return { text: pack.slogan, linkText: pack.secondaryCta, linkUrl: '#' }

    case 'footer':
      return {
        logo: pack.name,
        copyright: `${new Date().getFullYear()} ${pack.name}. All rights reserved.`,
        links: pack.menu,
        columns: [
          { title: 'Explore', links: pack.menu.slice(0, 3) },
          { title: 'Contact', links: ['Call us', 'Email', 'Directions'] },
        ],
      }
  }
}

export interface TemplateDefinition {
  id: string
  /** Name on the card in the gallery. */
  name: string
  description: string
  packId: string
  styleId: string
  arrangementId: string
}

export function buildFromDefinition(definition: TemplateDefinition): SiteConfig {
  const pack = packById(definition.packId)
  const arrangement = arrangementById(definition.arrangementId)

  const blocks: BlockConfig[] = arrangement.sections.map((section) => ({
    id: newId(`block-${section.type}`),
    type: section.type,
    variant: section.variant,
    props: propsFor(section, pack),
  }))

  return {
    name: pack.name,
    theme: styleById(definition.styleId),
    blocks,
  }
}
