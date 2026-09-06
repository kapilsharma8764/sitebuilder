import type { BlockConfig, SiteConfig } from '@/blocks/types'
import type { BusinessProfile } from './profile'

/**
 * Pours the answers from the Create Website flow into a template.
 *
 * This is what makes the flow worth filling in: the business types its phone
 * number once and finds it already in the footer and the contact section. A
 * template that still says "Acme Inc" after all those questions is the thing
 * that makes a builder feel fake.
 *
 * Only fields the business actually filled in are used. A blank answer leaves
 * the template's own placeholder alone, which reads better than an empty gap.
 */

function pick(value: string | undefined, fallback: unknown): unknown {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function applyToBlock(block: BlockConfig, profile: BusinessProfile): BlockConfig {
  const { contact } = profile
  const props = { ...block.props }

  switch (block.type) {
    case 'navbar':
      props.logo = pick(profile.name, props.logo)
      break

    case 'hero':
      props.headline = pick(profile.name, props.headline)
      props.subheadline = pick(profile.slogan, props.subheadline)
      break

    case 'content':
      props.body = pick(profile.about, props.body)
      break

    case 'contact':
      props.subtitle = pick(
        [contact.mobile, contact.email].filter(Boolean).join('  ·  '),
        props.subtitle,
      )
      break

    case 'footer':
      props.logo = pick(profile.name, props.logo)
      if (profile.logoSquare.trim()) props.logoImage = profile.logoSquare.trim()
      if (profile.name.trim()) {
        props.copyright = `${new Date().getFullYear()} ${profile.name.trim()}. All rights reserved.`
      }
      break

    default:
      break
  }

  return { ...block, props }
}

export function applyProfile(config: SiteConfig, profile: BusinessProfile): SiteConfig {
  const applyAll = (blocks: BlockConfig[]) => blocks.map((block) => applyToBlock(block, profile))

  return {
    ...config,
    name: profile.name.trim() || config.name,
    // The header and footer are shared across pages, so they carry the business
    // name and logo and must be filled in too.
    header: config.header ? applyAll(config.header) : undefined,
    footer: config.footer ? applyAll(config.footer) : undefined,
    blocks: applyAll(config.blocks),
    pages: config.pages?.map((page) => ({ ...page, blocks: applyAll(page.blocks) })),
  }
}
