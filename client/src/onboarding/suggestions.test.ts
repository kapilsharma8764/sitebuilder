import { describe, it, expect } from 'vitest'
import { suggestAbout, suggestSlogans } from './suggestions'
import { emptyProfile } from './profile'

const coaching = {
  ...emptyProfile,
  category: 'education' as const,
  audience: 'b2c' as const,
  name: 'Sharma Coaching Classes',
}

describe('suggestions', () => {
  it('offers several slogans so a second press gives something new', () => {
    expect(suggestSlogans(coaching).length).toBeGreaterThan(2)
    expect(new Set(suggestSlogans(coaching)).size).toBe(suggestSlogans(coaching).length)
  })

  it('suits the slogans to the kind of business', () => {
    const forSchool = suggestSlogans(coaching).join(' ').toLowerCase()
    const forTrade = suggestSlogans({
      ...emptyProfile,
      category: 'business',
      offer: 'services',
      name: 'BrightHouse',
    })
      .join(' ')
      .toLowerCase()
    expect(forSchool).not.toBe(forTrade)
    expect(forSchool).toContain('student')
  })

  it('writes the About draft around the business name', () => {
    const about = suggestAbout(coaching)
    expect(about).toContain(coaching.name)
    expect(about.startsWith('## ')).toBe(true)
    expect(about).toContain('- ')
  })

  it('still writes something usable before a name is entered', () => {
    // Someone may press it early; an About that says "undefined" would be worse
    // than one that is merely generic.
    const about = suggestAbout(emptyProfile)
    expect(about).not.toContain('undefined')
    expect(about.length).toBeGreaterThan(60)
  })
})
