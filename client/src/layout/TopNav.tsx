import { NavLink } from 'react-router-dom'
import { Home, Inbox, LayoutDashboard, LogOut, Pencil, Settings, Menu, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/dashboard', label: 'Sites', icon: LayoutDashboard },
  { to: '/editor', label: 'Editor', icon: Pencil },
  { to: '/leads', label: 'Enquiries', icon: Inbox },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)

  return (
    <header className="h-12 bg-bg-1 border-b border-border-default flex items-center px-4 gap-2 fixed top-0 left-0 right-0 z-50">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2 mr-6 select-none">
        <svg viewBox="0 0 32 32" className="w-5 h-5" aria-hidden="true">
          <rect width="32" height="32" rx="7" fill="#0b0b0b" />
          <rect x="7" y="7" width="18" height="4" rx="1.5" fill="#ffffff" />
          <rect x="7" y="13.5" width="10.5" height="11.5" rx="1.5" fill="#6366f1" />
          <rect x="19.5" y="13.5" width="5.5" height="5" rx="1.5" fill="#a855f7" />
          <rect x="19.5" y="20" width="5.5" height="5" rx="1.5" fill="#a855f7" opacity="0.55" />
        </svg>
        <span className="font-display font-bold text-base text-text-0 tracking-tight">
          SiteBuilder
        </span>
      </NavLink>

      {/* Desktop nav */}
      <nav className="hidden md:flex h-full items-stretch gap-0.5" aria-label="Main navigation">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `px-3.5 flex items-center text-[13px] relative transition-colors whitespace-nowrap gap-1.5 after:content-[""] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-t after:transition-all after:duration-200 ${
                isActive
                  ? 'text-text-0 after:bg-brand after:opacity-100'
                  : 'text-text-2 hover:text-text-1 after:bg-transparent after:opacity-0'
              }`
            }
          >
            <Icon size={14} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        {user && (
          <>
            <span
              className="hidden lg:inline text-[11.5px] text-text-3 max-w-[160px] truncate"
              title={user.email}
            >
              {user.name || user.email}
            </span>
            <button
              type="button"
              onClick={signOut}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border-default text-text-2 text-[11.5px] hover:text-text-0 hover:border-border-hover hover:bg-bg-2 transition-all"
              title="Sign out"
            >
              <LogOut size={12} />
              Sign out
            </button>
          </>
        )}

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center text-text-2 hover:text-text-0"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="absolute top-12 left-0 right-0 bg-bg-1 border-b border-border-default md:hidden z-50">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-[13px] transition-colors ${
                  isActive ? 'text-brand bg-brand-glow' : 'text-text-1 hover:bg-bg-2'
                }`
              }
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
