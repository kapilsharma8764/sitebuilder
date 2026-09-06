import type { BusinessProfile } from './profile'

/**
 * Suggested wording for the slogan and the About text.
 *
 * The brief asks for a "suggest" button beside these two fields, because a lot
 * of business owners stall on exactly them — they know their trade and cannot
 * think how to write about it.
 *
 * These are composed here rather than asked of a language model. That keeps
 * the button instant, free, and working without a key, and — more importantly
 * — honest: it is offered as a starting point to edit, not passed off as
 * something written for them. When a model is wired up later it can replace
 * `suggestSlogans`; nothing else needs to change.
 */

type Key = 'education' | 'product' | 'services' | 'technology' | 'general'

function keyFor(profile: BusinessProfile): Key {
  if (profile.category === 'education') return 'education'
  if (profile.category === 'technology') return 'technology'
  if (profile.offer === 'product') return 'product'
  if (profile.offer === 'services') return 'services'
  return 'general'
}

const SLOGANS: Record<Key, string[]> = {
  education: [
    'Small batches. Senior teachers. Real results.',
    'Where questions matter more than answers.',
    'Teaching that stays with you long after the exam.',
    'Every student taught, not just every class covered.',
  ],
  product: [
    'Made properly, priced fairly.',
    'Built to last longer than the warranty.',
    'The quality you would choose for yourself.',
    'Honest materials, careful work.',
  ],
  services: [
    'Done right the first time.',
    'On time, at the price we quoted.',
    'Careful work from people who turn up.',
    'The job finished, not just started.',
  ],
  technology: [
    'Software that stays out of your way.',
    'Built for the people who actually use it.',
    'Fewer clicks. Less waiting. More done.',
    'Powerful underneath, simple on top.',
  ],
  general: [
    'Trusted by the people who know us best.',
    'Straight answers and careful work.',
    'The people your neighbours recommend.',
    'Doing one thing, and doing it well.',
  ],
}

const OPENERS: Record<Key, (name: string) => string> = {
  education: (name) =>
    `${name} has been teaching students in this city for years. Classes are kept small, so every student gets attention and every parent knows exactly how their child is doing.`,
  product: (name) =>
    `${name} makes and sells products we would be happy to use ourselves. We choose materials carefully, price them honestly, and stand behind everything that leaves our hands.`,
  services: (name) =>
    `${name} has built its reputation on turning up when we said we would and finishing the job properly. You get a clear quote before we start, and no surprises after.`,
  technology: (name) =>
    `${name} builds software for people with real work to do. We keep it simple where it can be simple, and careful where it cannot.`,
  general: (name) =>
    `${name} has served customers here for years, and most of our work now comes from people we have already looked after. We think that says more than anything we could write.`,
}

const POINTS: Record<Key, string[]> = {
  education: [
    'Small batches with individual attention',
    'Regular tests and honest feedback',
    'Doubt sessions through the week',
  ],
  product: [
    'Carefully chosen materials',
    'Fair, clearly stated prices',
    'Replacement if anything is wrong',
  ],
  services: [
    'A written quote before any work starts',
    'Trained, background-checked staff',
    'We come back if something is not right',
  ],
  technology: [
    'Set up in minutes, not weeks',
    'Support from the people who built it',
    'Your data stays yours',
  ],
  general: ['Years of experience', 'Clear, fair pricing', 'Most customers come back'],
}

export function suggestSlogans(profile: BusinessProfile): string[] {
  const key = keyFor(profile)
  const audience =
    profile.audience === 'b2b'
      ? 'Built for businesses that cannot afford to get it wrong.'
      : profile.audience === 'b2c'
        ? 'Looked after like family, priced like a friend.'
        : null

  return audience ? [...SLOGANS[key], audience] : SLOGANS[key]
}

/** A first draft of the About section, in Markdown, ready to be edited. */
export function suggestAbout(profile: BusinessProfile): string {
  const key = keyFor(profile)
  const name = profile.name.trim() || 'We'
  const points = POINTS[key].map((point) => `- ${point}`).join('\n')

  return `## About us\n\n${OPENERS[key](name)}\n\n${points}`
}
