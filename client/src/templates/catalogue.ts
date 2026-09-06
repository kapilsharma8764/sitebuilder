import type { WebsiteCategory } from '@/onboarding/profile'
import { packById } from './content'
import { styleSets } from './styles'
import { arrangementById } from './arrangements'
import type { TemplateDefinition } from './build'

/**
 * The design gallery.
 *
 * Forty templates from sixteen sets of words, ten looks and five section
 * orders. Each entry pairs a trade with a look that suits it — a barber gets
 * the bold dark set, a dental clinic the calm green one — so the gallery reads
 * as forty considered designs rather than a grid of colour swatches.
 *
 * Adding another is three lines: pick a pack, a style and an arrangement.
 */

export interface TemplateCard extends TemplateDefinition {
  category: WebsiteCategory
  keywords: string[]
  /** The style set's accent, so a card can be tinted without building the site. */
  accent: string
  /** Lucide icon name, used where a card has no room for a preview. */
  icon: string
  /** How many sections the design starts with. */
  blockCount: number
}

const categoryIcons: Record<WebsiteCategory, string> = {
  education: 'GraduationCap',
  business: 'Store',
  technology: 'Cpu',
  other: 'LayoutTemplate',
}

function card(
  id: string,
  name: string,
  description: string,
  packId: string,
  styleId: string,
  arrangementId: string,
): TemplateCard {
  const pack = packById(packId)
  const style = styleSets.find((set) => set.id === styleId)
  return {
    id,
    name,
    description,
    packId,
    styleId,
    arrangementId,
    category: pack.category,
    keywords: [...pack.keywords, pack.label.toLowerCase(), name.toLowerCase()],
    accent: style?.theme.accent ?? '#6366f1',
    icon: categoryIcons[pack.category],
    blockCount: arrangementById(arrangementId).sections.length,
  }
}

export const templateCards: TemplateCard[] = [
  // Education
  card('scholar', 'Scholar', 'Coaching centre with courses, results and enquiries', 'coaching', 'education-blue', 'service'),
  card('mentor', 'Mentor', 'Tutoring built around a free first class', 'coaching', 'clean-saas', 'landing'),
  card('chalkboard', 'Chalkboard', 'Coaching centre with a photo-led homepage', 'coaching', 'warm-service', 'showcase'),
  card('campus', 'Campus', 'School site with admissions front and centre', 'school', 'education-blue', 'showcase'),
  card('greenfield', 'Greenfield', 'School with a calm, natural palette', 'school', 'eco-green', 'service'),
  card('assembly', 'Assembly', 'School homepage that leads with results', 'school', 'clean-saas', 'landing'),

  // Food
  card('saffron', 'Saffron', 'Restaurant with menu, gallery and table booking', 'restaurant', 'appetite-red', 'showcase'),
  card('tandoor', 'Tandoor', 'Restaurant with a dark, appetite-led homepage', 'restaurant', 'appetite-red', 'storefront'),
  card('supper', 'Supper', 'Restaurant styled as a quiet fine-dining room', 'restaurant', 'luxury-editorial', 'showcase'),
  card('griddle', 'Griddle', 'Restaurant with reviews and enquiries up front', 'restaurant', 'warm-service', 'service'),
  card('roast', 'Roast', 'Café with beans, bakes and opening hours', 'cafe', 'warm-service', 'storefront'),
  card('thirdwindow', 'Third Window', 'Café with a photo-led homepage', 'cafe', 'appetite-red', 'showcase'),
  card('brew', 'Brew', 'Café landing page for a single location', 'cafe', 'luxury-editorial', 'landing'),

  // Grooming and fitness
  card('blade', 'Blade', 'Barber shop with booking and prices', 'barber', 'bold-dark', 'service'),
  card('fade', 'Fade', 'Barber shop with a bold, image-first homepage', 'barber', 'bold-dark', 'storefront'),
  card('parlour', 'Parlour', 'Salon styled soft and editorial', 'barber', 'luxury-editorial', 'showcase'),
  card('ironyard', 'Iron Yard', 'Gym with classes, coaches and a free trial', 'gym', 'bold-dark', 'landing'),
  card('reps', 'Reps', 'Gym site that leads with membership terms', 'gym', 'bold-dark', 'service'),
  card('studio-fit', 'Studio', 'Boutique fitness studio, light and airy', 'gym', 'fresh-mint', 'showcase'),

  // Health
  card('meridian', 'Meridian', 'Dental clinic with treatments and fees', 'clinic', 'fresh-mint', 'service'),
  card('wellspring', 'Wellspring', 'Clinic with a calm, natural palette', 'clinic', 'eco-green', 'showcase'),
  card('pulse', 'Pulse', 'Clinic landing page with same-day booking', 'clinic', 'clean-saas', 'landing'),

  // Home and property
  card('sunwatt', 'Sunwatt', 'Solar installer with savings and quotes', 'solar', 'eco-green', 'landing'),
  card('daylight', 'Daylight', 'Solar company with projects and payback figures', 'solar', 'fresh-mint', 'service'),
  card('atelier', 'Atelier', 'Interior studio with a quiet, editorial layout', 'interior', 'luxury-editorial', 'showcase'),
  card('nine', 'Nine', 'Interior design with process and fixed fees', 'interior', 'warm-service', 'service'),
  card('northgate', 'Northgate', 'Builder with projects, warranty and quotes', 'construction', 'tech-slate', 'service'),
  card('foundation', 'Foundation', 'Construction firm with a schedule-led homepage', 'construction', 'bold-dark', 'landing'),
  card('keyline', 'Keyline', 'Property agency with verified listings', 'realestate', 'clean-saas', 'showcase'),
  card('doorstep', 'Doorstep', 'Property site built around a shortlist', 'realestate', 'luxury-editorial', 'storefront'),
  card('brighthouse', 'Brighthouse', 'Cleaning service with fixed prices', 'cleaning', 'fresh-mint', 'service'),
  card('sparkle', 'Sparkle', 'Cleaning company with booking up front', 'cleaning', 'clean-saas', 'landing'),

  // Professional
  card('northline', 'Northline', 'Creative agency with work and process', 'agency', 'deep-purple', 'showcase'),
  card('meridian-co', 'Meridian & Co', 'Agency with a clean, restrained homepage', 'agency', 'clean-saas', 'landing'),
  card('atlas', 'Atlas', 'Agency styled dark with a bright accent', 'agency', 'bold-dark', 'product'),
  card('ashworth', 'Ashworth', 'Consulting practice with sectors and team', 'consulting', 'tech-slate', 'service'),
  card('counsel', 'Counsel', 'Advisory firm, formal and typographic', 'consulting', 'luxury-editorial', 'showcase'),

  // Technology
  card('ledgerly', 'Ledgerly', 'Software product with pricing and FAQ', 'software', 'clean-saas', 'product'),
  card('orbit', 'Orbit', 'SaaS landing page, dark with a purple accent', 'software', 'deep-purple', 'product'),
  card('blackpine', 'Blackpine', 'Managed IT services with response times', 'itservices', 'tech-slate', 'service'),
]

/**
 * Best guess at a design from a sentence someone typed.
 *
 * Used by the AI route as a fallback when no model is configured: matching a
 * few keywords still hands back a finished, on-topic site rather than an error.
 */
export function templateForPrompt(prompt: string): TemplateCard {
  const words = prompt.toLowerCase()
  const matched = templateCards.find((card) =>
    card.keywords.some((keyword) => words.includes(keyword)),
  )
  return matched ?? templateCards[0]
}
