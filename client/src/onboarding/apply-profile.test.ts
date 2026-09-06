import { describe, it, expect } from 'vitest'
import { applyProfile } from './apply-profile'
import { emptyProfile } from './profile'
import { templateCards } from '@/templates/catalogue'
import { buildFromDefinition } from '@/templates/build'
import type { SiteConfig } from '@/blocks/types'

const filled = {
  ...emptyProfile,
  category: 'education' as const,
  audience: 'b2c' as const,
  name: 'Sharma Coaching Classes',
  slogan: 'Learning that lasts',
  about: 'We have taught maths and science in Jaipur since 2011.',
  contact: {
    ...emptyProfile.contact,
    mobile: '98765 43210',
    email: 'hello@sharma.example',
  },
}

function build(id: string) {
  const card = templateCards.find((c) => c.id === id)
  if (!card) throw new Error(`no template ${id}`)
  return buildFromDefinition(card)
}

function blocksOf(config: SiteConfig) {
  return [...config.blocks, ...(config.pages?.flatMap((page) => page.blocks) ?? [])]
}

describe('applyProfile', () => {
  it('puts the business name into the header, hero and footer', () => {
    const config = applyProfile(build('northline'), filled)
    const blocks = blocksOf(config)

    expect(blocks.find((b) => b.type === 'navbar')?.props.logo).toBe(filled.name)
    expect(blocks.find((b) => b.type === 'hero')?.props.headline).toBe(filled.name)
    expect(blocks.find((b) => b.type === 'footer')?.props.logo).toBe(filled.name)
  })

  it('writes the copyright line from the business name', () => {
    const config = applyProfile(build('northline'), filled)
    const footer = blocksOf(config).find((b) => b.type === 'footer')
    expect(footer?.props.copyright).toContain(filled.name)
    expect(footer?.props.copyright).toContain(String(new Date().getFullYear()))
  })

  it('shows how to reach the business in the contact section', () => {
    const config = applyProfile(build('blackpine'), filled)
    const contact = blocksOf(config).find((b) => b.type === 'contact')
    expect(contact?.props.subtitle).toContain('98765 43210')
    expect(contact?.props.subtitle).toContain('hello@sharma.example')
  })

  it('leaves the template alone where the business answered nothing', () => {
    // A half-filled form must not blank out a template. Whatever the user
    // skipped keeps the design's own wording.
    const before = build('saffron')
    const after = applyProfile(before, emptyProfile)

    const heroBefore = blocksOf(before).find((b) => b.type === 'hero')
    const heroAfter = blocksOf(after).find((b) => b.type === 'hero')
    expect(heroAfter?.props.headline).toBe(heroBefore?.props.headline)
    expect(heroAfter?.props.subheadline).toBe(heroBefore?.props.subheadline)
    expect(after.name).toBe(before.name)
  })

  it('puts an uploaded logo in the header', () => {
    // The flow asks for a logo and says it will appear on the site. If it does
    // not reach the header, the whole step was a waste of the owner's time.
    const withLogo = { ...filled, logo: 'https://example.com/logo.png' }
    const config = applyProfile(build('northline'), withLogo)
    const navbar = blocksOf(config).find((b) => b.type === 'navbar')
    expect(navbar?.props.logoImage).toBe(withLogo.logo)
  })

  it('leaves the header alone when no logo was uploaded', () => {
    const config = applyProfile(build('northline'), filled)
    const navbar = blocksOf(config).find((b) => b.type === 'navbar')
    expect(navbar?.props.logoImage ?? '').toBe('')
  })

  it('never drops or reorders blocks', () => {
    for (const meta of templateCards) {
      const before = buildFromDefinition(meta)
      const after = applyProfile(before, filled)
      expect(blocksOf(after).map((b) => b.id)).toEqual(blocksOf(before).map((b) => b.id))
    }
  })
})
