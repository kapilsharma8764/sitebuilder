import type { BlockConfig } from '../types'
import { Menu } from 'lucide-react'

interface NavbarProps {
  logo: string
  /** The business's own logo. Shown instead of the name when there is one. */
  logoImage?: string
  links: string[]
  ctaText: string
}

/**
 * The business's mark in the header.
 *
 * A logo uploaded during setup belongs here — it was collected on the promise
 * of appearing on the site, and until now the header only ever showed text
 * beside a generic coloured dot.
 */
function Brand({ logo, logoImage }: { logo: string; logoImage?: string }) {
  if (logoImage) {
    return (
      <img
        src={logoImage}
        alt={logo}
        className="h-8 w-auto max-w-[180px] object-contain"
      />
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-brand" />
      </div>
      <span data-edit="logo" className="font-semibold text-[15px] text-text-0 tracking-tight">{logo}</span>
    </div>
  )
}

function NavbarDefault({ props }: { props: NavbarProps }) {
  const { logo, links = [], ctaText } = props

  return (
    <nav className="px-6 @md:px-10 py-4 flex items-center justify-between">
      {/* Logo */}
      <Brand logo={logo} logoImage={props.logoImage} />

      {/* Desktop nav links */}
      <div className="hidden @2xl:flex items-center gap-6">
        {links.map((link, i) => (
          <span
            key={i}
            className="text-[13px] text-text-2 hover:text-text-0 transition-colors cursor-pointer"
          >
            {link}
          </span>
        ))}
      </div>

      {/* CTA + mobile menu */}
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 rounded-lg bg-brand text-white text-[13px] font-semibold hover:bg-brand-dim transition-colors">
          {ctaText}
        </button>
        <button className="@2xl:hidden w-9 h-9 rounded-lg border border-border-default flex items-center justify-center text-text-2 hover:text-text-0 hover:bg-bg-3 transition-colors">
          <Menu size={16} />
        </button>
      </div>
    </nav>
  )
}

function NavbarCentered({ props }: { props: NavbarProps }) {
  const { logo, links = [], ctaText } = props
  const mid = Math.ceil(links.length / 2)
  const leftLinks = links.slice(0, mid)
  const rightLinks = links.slice(mid)

  return (
    <nav className="px-6 @md:px-10 py-4 flex items-center justify-between">
      {/* Left links */}
      <div className="hidden @2xl:flex items-center gap-6 flex-1">
        {leftLinks.map((link, i) => (
          <span key={i} className="text-[13px] text-text-2 hover:text-text-0 transition-colors cursor-pointer">
            {link}
          </span>
        ))}
      </div>

      {/* Center logo */}
      <Brand logo={logo} logoImage={props.logoImage} />

      {/* Right links + CTA */}
      <div className="hidden @2xl:flex items-center gap-6 flex-1 justify-end">
        {rightLinks.map((link, i) => (
          <span key={i} className="text-[13px] text-text-2 hover:text-text-0 transition-colors cursor-pointer">
            {link}
          </span>
        ))}
        <button className="px-4 py-2 rounded-lg bg-brand text-white text-[13px] font-semibold hover:bg-brand-dim transition-colors ml-2">
          {ctaText}
        </button>
      </div>

      {/* Mobile menu */}
      <button className="@2xl:hidden w-9 h-9 rounded-lg border border-border-default flex items-center justify-center text-text-2 hover:text-text-0 hover:bg-bg-3 transition-colors">
        <Menu size={16} />
      </button>
    </nav>
  )
}

export function NavbarBlock({ block }: { block: BlockConfig }) {
  const props = block.props as unknown as NavbarProps

  switch (block.variant) {
    case 'centered':
      return <NavbarCentered props={props} />
    default:
      return <NavbarDefault props={props} />
  }
}
