/**
 * Everything the builder asks a business before it shows them a template.
 *
 * These answers are collected once and then pushed into the site — the phone
 * number reaches the footer and the contact section, the logo reaches the
 * header, the business name reaches every heading that mentions it. Asking
 * twice is the fastest way to make the flow feel long, so nothing here is
 * asked again later.
 */

export type WebsiteCategory = 'education' | 'business' | 'technology' | 'other'

/** Business, technology and "other" sites sell either a product or a service. */
export type OfferKind = 'product' | 'services' | 'both'

/** Who the business sells to. Shapes the wording a template starts with. */
export type Audience = 'b2b' | 'b2c' | 'both'

export interface ContactDetails {
  mobile: string
  /** Whether the mobile number also takes WhatsApp — drives the chat button. */
  whatsapp: boolean
  altMobile: string
  email: string
  address: string
  /** A Google Maps share link or embed URL. */
  mapUrl: string
  officeTiming: string
}

export interface BusinessProfile {
  category: WebsiteCategory | null
  offer: OfferKind | null
  audience: Audience | null

  name: string
  /** Wide logo shown in the header. */
  logo: string
  /** Square mark, used for the browser tab icon and small placements. */
  logoSquare: string
  slogan: string
  about: string

  contact: ContactDetails
}

export const emptyProfile: BusinessProfile = {
  category: null,
  offer: null,
  audience: null,
  name: '',
  logo: '',
  logoSquare: '',
  slogan: '',
  about: '',
  contact: {
    mobile: '',
    whatsapp: true,
    altMobile: '',
    email: '',
    address: '',
    mapUrl: '',
    officeTiming: '',
  },
}

export const categoryOptions: { value: WebsiteCategory; label: string; hint: string }[] = [
  { value: 'education', label: 'Education', hint: 'School, coaching, training, courses' },
  { value: 'business', label: 'Business', hint: 'Shop, agency, clinic, contractor' },
  { value: 'technology', label: 'Technology', hint: 'Software, app, IT services' },
  { value: 'other', label: 'Something else', hint: 'Anything not listed here' },
]

export const offerOptions: { value: OfferKind; label: string; hint: string }[] = [
  { value: 'product', label: 'Products', hint: 'You sell things people buy' },
  { value: 'services', label: 'Services', hint: 'You do work for people' },
  { value: 'both', label: 'Both', hint: 'Products and services' },
]

export const audienceOptions: { value: Audience; label: string; hint: string }[] = [
  { value: 'b2c', label: 'B2C', hint: 'You sell to ordinary customers' },
  { value: 'b2b', label: 'B2B', hint: 'You sell to other businesses' },
  { value: 'both', label: 'Both', hint: 'Customers and businesses' },
]

/**
 * True once the wizard has enough to build a site.
 *
 * Only the choices that change what gets built are required. A business with
 * no logo file to hand should still reach a template, so everything else is
 * optional and can be filled in later from the editor.
 */
export function isProfileComplete(profile: BusinessProfile): boolean {
  return Boolean(profile.category && profile.audience && profile.name.trim())
}
