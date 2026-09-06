import type { ThemeConfig } from '@/blocks/types'

/**
 * The ten looks every template is built from.
 *
 * Studying a few hundred professional templates, the striking thing is how
 * little the structure varies — nearly all of them are a header, a headline
 * with two buttons, a row of numbers, a photo, some cards, reviews and a
 * footer. What separates a barber's site from a solar company's is colour,
 * type, corner radius and how much air the layout has.
 *
 * So rather than draw forty designs, we draw ten style sets and combine them
 * with a handful of section orders. Each set below is lifted from a real
 * category of site, not invented from a palette generator.
 */

interface StyleSet {
  id: string
  name: string
  /** One line on when to reach for it. */
  suits: string
  theme: ThemeConfig
}

/** Shared skeleton so each set only states what makes it different. */
function light(overrides: Partial<ThemeConfig>): ThemeConfig {
  return {
    bg0: '#ffffff',
    bg1: '#ffffff',
    bg2: '#f6f6f7',
    bg3: '#ededf0',
    bg4: '#dcdce1',
    bg5: '#c3c3cb',
    text0: '#0d0d10',
    text1: '#3f3f46',
    text2: '#6b6b76',
    text3: '#9a9aa5',
    accent: '#6366f1',
    accentDim: '#4f46e5',
    borderDefault: '#e4e4e8',
    borderSubtle: '#efeff2',
    borderHover: '#cfcfd6',
    fontSans: 'DM Sans',
    fontDisplay: 'Space Grotesk',
    fontMono: 'JetBrains Mono',
    radius: 10,
    radiusLg: 16,
    ...overrides,
  }
}

function dark(overrides: Partial<ThemeConfig>): ThemeConfig {
  return {
    bg0: '#0b0d12',
    bg1: '#11141b',
    bg2: '#171b24',
    bg3: '#1e232e',
    bg4: '#2a3040',
    bg5: '#3a4255',
    text0: '#f7f8fa',
    text1: '#c2c7d2',
    text2: '#8b93a4',
    text3: '#606877',
    accent: '#facc15',
    accentDim: '#eab308',
    borderDefault: '#242a36',
    borderSubtle: '#1a1f28',
    borderHover: '#333c4c',
    fontSans: 'DM Sans',
    fontDisplay: 'Space Grotesk',
    fontMono: 'JetBrains Mono',
    radius: 8,
    radiusLg: 12,
    ...overrides,
  }
}

export const styleSets: StyleSet[] = [
  {
    id: 'clean-saas',
    name: 'Clean',
    suits: 'Software, apps, anything that wants to look calm and current',
    theme: light({
      bg2: '#f5f4fd',
      bg3: '#ebe9fb',
      accent: '#6366f1',
      accentDim: '#4f46e5',
      fontSans: 'Inter',
      fontDisplay: 'Inter',
      radius: 12,
      radiusLg: 20,
    }),
  },
  {
    id: 'warm-service',
    name: 'Warm',
    suits: 'Plumbers, electricians, repairs — trades that want to feel friendly',
    theme: light({
      bg0: '#fffdf9',
      bg1: '#fffdf9',
      bg2: '#fdf3e7',
      bg3: '#f9e6cf',
      accent: '#ea7317',
      accentDim: '#c85f0d',
      fontSans: 'DM Sans',
      fontDisplay: 'DM Sans',
      radius: 12,
      radiusLg: 18,
    }),
  },
  {
    id: 'bold-dark',
    name: 'Bold',
    suits: 'Barbers, gyms, garages — confident and a little loud',
    theme: dark({
      accent: '#facc15',
      accentDim: '#eab308',
      fontSans: 'Inter',
      fontDisplay: 'Bebas Neue',
      radius: 6,
      radiusLg: 10,
    }),
  },
  {
    id: 'fresh-mint',
    name: 'Fresh',
    suits: 'Cleaning, laundry, hygiene — light and reassuring',
    theme: light({
      bg2: '#eefaf6',
      bg3: '#d8f3ea',
      accent: '#0d9488',
      accentDim: '#0f766e',
      fontSans: 'Poppins',
      fontDisplay: 'Poppins',
      radius: 14,
      radiusLg: 22,
    }),
  },
  {
    id: 'luxury-editorial',
    name: 'Editorial',
    suits: 'Interiors, hotels, jewellery — quiet, expensive, lots of air',
    theme: light({
      bg0: '#fbf9f5',
      bg1: '#fbf9f5',
      bg2: '#f2ede4',
      bg3: '#e6ddcd',
      text0: '#1a1713',
      accent: '#8a6d3f',
      accentDim: '#6f5730',
      borderDefault: '#e2d9c9',
      fontSans: 'DM Sans',
      fontDisplay: 'Playfair Display',
      radius: 2,
      radiusLg: 4,
    }),
  },
  {
    id: 'tech-slate',
    name: 'Technical',
    suits: 'IT services, developer tools, anything technical',
    theme: light({
      bg2: '#f4f5f7',
      bg3: '#e8eaee',
      text0: '#0a0a0a',
      accent: '#f97316',
      accentDim: '#ea580c',
      fontSans: 'Inter',
      fontDisplay: 'Inter',
      fontMono: 'JetBrains Mono',
      radius: 8,
      radiusLg: 12,
    }),
  },
  {
    id: 'eco-green',
    name: 'Natural',
    suits: 'Solar, farming, clinics, anything about health or the planet',
    theme: light({
      bg2: '#f0f7ee',
      bg3: '#deeeda',
      accent: '#3f8f45',
      accentDim: '#2f6f35',
      fontSans: 'DM Sans',
      fontDisplay: 'DM Sans',
      radius: 12,
      radiusLg: 20,
    }),
  },
  {
    id: 'deep-purple',
    name: 'Deep',
    suits: 'Recruitment, startups, events — dark with a bright accent',
    theme: dark({
      bg0: '#150f2b',
      bg1: '#1b1436',
      bg2: '#241a47',
      bg3: '#2e2159',
      bg4: '#3d2c75',
      bg5: '#4f3a93',
      accent: '#a855f7',
      accentDim: '#9333ea',
      borderDefault: '#2f2359',
      borderSubtle: '#241a47',
      borderHover: '#43317e',
      fontSans: 'Inter',
      fontDisplay: 'Space Grotesk',
      radius: 12,
      radiusLg: 20,
    }),
  },
  {
    id: 'education-blue',
    name: 'Scholarly',
    suits: 'Schools, coaching, training — trustworthy and plain',
    theme: light({
      bg2: '#eef4fc',
      bg3: '#dbe8f8',
      accent: '#1d4ed8',
      accentDim: '#1e40af',
      fontSans: 'Poppins',
      fontDisplay: 'Poppins',
      radius: 10,
      radiusLg: 16,
    }),
  },
  {
    id: 'appetite-red',
    name: 'Appetite',
    suits: 'Restaurants, cafés, food — dark, warm, hungry',
    theme: dark({
      bg0: '#120c0b',
      bg1: '#191110',
      bg2: '#221715',
      bg3: '#2d1e1b',
      bg4: '#3d2925',
      bg5: '#523631',
      accent: '#e0533d',
      accentDim: '#c33f2b',
      borderDefault: '#2c1e1b',
      borderSubtle: '#211715',
      borderHover: '#3f2b26',
      fontSans: 'DM Sans',
      fontDisplay: 'Playfair Display',
      radius: 6,
      radiusLg: 12,
    }),
  },
]

export function styleById(id: string): ThemeConfig {
  return (styleSets.find((set) => set.id === id) ?? styleSets[0]).theme
}
