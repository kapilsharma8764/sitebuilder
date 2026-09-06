import { describe, it, expect } from 'vitest'
import { templateCards } from './catalogue'
import { buildFromDefinition } from './build'
import { contentPacks } from './content'
import { photos } from './photos'
import { styleSets } from './styles'
import { arrangements } from './arrangements'
import { blockMetadata } from '@/lib/block-metadata'

describe('template catalogue', () => {
  it('offers a substantial gallery', () => {
    expect(templateCards.length).toBeGreaterThanOrEqual(40)
  })

  it('gives every template a unique id and name', () => {
    const ids = templateCards.map((c) => c.id)
    const names = templateCards.map((c) => c.name)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(names).size).toBe(names.length)
  })

  it('points every template at content, a style and an arrangement that exist', () => {
    for (const card of templateCards) {
      expect(contentPacks.some((p) => p.id === card.packId), `${card.id} packId`).toBe(true)
      expect(styleSets.some((s) => s.id === card.styleId), `${card.id} styleId`).toBe(true)
      expect(
        arrangements.some((a) => a.id === card.arrangementId),
        `${card.id} arrangementId`,
      ).toBe(true)
    }
  })

  it('covers every category a business can pick', () => {
    const covered = new Set(templateCards.map((c) => c.category))
    for (const category of ['education', 'business', 'technology'] as const) {
      expect(covered.has(category), `no template for ${category}`).toBe(true)
    }
  })

  it('builds every template into blocks the renderer knows', () => {
    const known = new Set(blockMetadata.map((b) => b.type))
    for (const card of templateCards) {
      const config = buildFromDefinition(card)
      expect(config.blocks.length, `${card.id} is empty`).toBeGreaterThan(4)
      for (const block of config.blocks) {
        expect(known.has(block.type), `${card.id} uses unknown block ${block.type}`).toBe(true)
        const meta = blockMetadata.find((b) => b.type === block.type)
        expect(
          meta?.variants.includes(block.variant),
          `${card.id} asks ${block.type} for variant "${block.variant}"`,
        ).toBe(true)
      }
    }
  })

  it('starts every template with a header and ends it with a footer', () => {
    for (const card of templateCards) {
      const types = buildFromDefinition(card).blocks.map((b) => b.type)
      expect(types, `${card.id} has no navbar`).toContain('navbar')
      expect(types[types.length - 1], `${card.id} does not end in a footer`).toBe('footer')
    }
  })

  it('writes real content, never placeholder text', () => {
    // A template full of "Lorem ipsum" gives the owner nothing to react to,
    // and reacting is how people edit.
    const banned = /lorem ipsum|your headline here|placeholder|coming soon|todo/i
    for (const card of templateCards) {
      const text = JSON.stringify(buildFromDefinition(card).blocks)
      expect(banned.test(text), `${card.id} contains placeholder text`).toBe(false)
    }
  })

  it('fills every content pack with usable copy', () => {
    for (const pack of contentPacks) {
      expect(pack.services.length, `${pack.id} has no services`).toBeGreaterThanOrEqual(3)
      expect(pack.stats.length, `${pack.id} has no stats`).toBeGreaterThanOrEqual(3)
      expect(pack.reviews.length, `${pack.id} has no reviews`).toBeGreaterThanOrEqual(3)
      expect(pack.faq.length, `${pack.id} has no questions`).toBeGreaterThanOrEqual(3)
      expect(pack.photos.length, `${pack.id} has no photos`).toBeGreaterThan(0)
      for (const name of pack.photos) {
        expect(photos[name], `${pack.id} uses unknown photo ${name}`).toBeTruthy()
      }
    }
  })

  it('asks the image CDN for a sized, compressed photo', () => {
    // Requesting the original file is what makes a template slow to open.
    const config = buildFromDefinition(templateCards[0])
    const text = JSON.stringify(config.blocks)
    const urls = text.match(/https:\/\/images\.unsplash\.com\/[^"]+/g) ?? []
    expect(urls.length).toBeGreaterThan(0)
    for (const url of urls) {
      expect(url).toContain('auto=format')
      expect(url).toMatch(/[?&]w=\d+/)
    }
  })
})
