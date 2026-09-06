import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Check } from 'lucide-react'
import { toast } from 'sonner'
import { templateCards } from '@/templates/catalogue'
import { buildFromDefinition } from '@/templates/build'
import { RenderBlock } from '@/blocks/registry'
import { resolveTheme, themeToCSS } from '@/lib/theme-presets'
import { useConfigStore } from '@/store/configStore'
import { usePublishStore } from '@/store/publishStore'
import { api } from '@/lib/api'
import { useBusinessStore } from '@/store/businessStore'
import { applyProfile } from '@/onboarding/apply-profile'
import type { SiteConfig } from '@/blocks/types'

/**
 * Pick a design, with the business's own words already in it.
 *
 * Every card is the real thing rendered small, not a screenshot — so what the
 * user picks is exactly what opens in the editor, and previews can never go
 * stale as widgets change.
 */

function TemplatePreview({ config }: { config: SiteConfig }) {
  const cssVars = useMemo(() => themeToCSS(resolveTheme(config.theme)), [config.theme])
  const blocks = config.pages?.[0]?.blocks ?? config.blocks

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg-0">
      <div
        className="@container absolute top-0 left-0 origin-top-left pointer-events-none select-none"
        style={{
          width: '1100px',
          transform: 'scale(0.29)',
          ...cssVars,
          color: 'var(--color-text-0)',
          backgroundColor: 'var(--color-bg-1)',
        }}
        aria-hidden="true"
      >
        {blocks.slice(0, 5).map((block) => (
          <RenderBlock key={block.id} block={block} />
        ))}
      </div>
    </div>
  )
}

export function Templates() {
  const navigate = useNavigate()
  const profile = useBusinessStore((s) => s.profile)
  const setConfig = useConfigStore((s) => s.setConfig)
  const setSite = usePublishStore((s) => s.setSite)
  const clearPublish = usePublishStore((s) => s.clear)

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string>(() => {
    // One is chosen from the start, so someone who is unsure can press
    // Continue and still end up with a finished-looking site.
    const suited = templateCards.find((c) => c.category === profile.category)
    return (suited ?? templateCards[0]).id
  })

  /** Built once per template, with the business's details already poured in. */
  const previews = useMemo(
    () =>
      templateCards.map((meta) => ({
        meta,
        config: applyProfile(buildFromDefinition(meta), profile),
        suits: meta.category === profile.category,
      })),
    [profile],
  )

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    const matched = query
      ? previews.filter(
          (p) =>
            p.meta.name.toLowerCase().includes(query) ||
            p.meta.description.toLowerCase().includes(query) ||
            p.meta.keywords.some((k) => k.includes(query)),
        )
      : previews
    // Designs that suit the answers given earlier come first.
    return [...matched].sort((a, b) => Number(b.suits) - Number(a.suits))
  }, [previews, search])

  async function applySelected() {
    const chosen = previews.find((p) => p.meta.id === selected)
    if (!chosen) return

    setConfig(chosen.config)
    clearPublish()

    // Register the new site so the editor can save into it. If the API is not
    // running the editor still opens — the design is applied either way, and
    // publishing will create the record then.
    try {
      const created = await api.createSite({
        name: profile.name.trim() || chosen.meta.name,
        config: chosen.config,
        profile,
      })
      setSite(created.id)
    } catch {
      // Left unsaved on purpose; nothing here should block reaching the editor.
    }

    toast(`${chosen.meta.name} applied`)
    navigate('/editor')
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="shrink-0 px-6 pt-8 pb-5 border-b border-border-default">
        <div className="max-w-6xl mx-auto">
          <button
            type="button"
            onClick={() => navigate('/create')}
            className="flex items-center gap-1.5 text-[12.5px] text-text-2 hover:text-text-0 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to details
          </button>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text-0 font-display">
                Choose a design
              </h1>
              <p className="mt-1 text-[12.5px] text-text-2">
                Each one already has your details in it. You can change anything
                afterwards.
              </p>
            </div>

            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-3"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search designs"
                aria-label="Search designs"
                className="w-56 pl-8 pr-3 py-2 rounded-xl border border-border-default bg-bg-2 text-text-0 text-[12.5px] outline-none focus:border-brand placeholder:text-text-3"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-7">
        <div className="max-w-6xl mx-auto">
          {visible.length === 0 ? (
            <p className="py-20 text-center text-[12.5px] text-text-3">
              No design matches “{search}”.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map(({ meta, config, suits }) => {
                const isSelected = selected === meta.id
                return (
                  <button
                    key={meta.id}
                    type="button"
                    onClick={() => setSelected(meta.id)}
                    aria-pressed={isSelected}
                    className={`group text-left rounded-2xl border overflow-hidden transition-all ${
                      isSelected
                        ? 'border-brand shadow-lg shadow-brand-glow'
                        : 'border-border-default hover:border-border-hover'
                    }`}
                  >
                    <div className="relative h-44 border-b border-border-default">
                      <TemplatePreview config={config} />
                      {isSelected && (
                        <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-brand grid place-items-center">
                          <Check size={11} className="text-white" />
                        </span>
                      )}
                    </div>

                    <div className="px-4 py-3 bg-bg-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-[13px] font-semibold text-text-0">{meta.name}</h2>
                        {suits && (
                          <span className="px-1.5 py-0.5 rounded-full bg-brand/12 border border-brand/25 text-[9.5px] text-brand">
                            Suits you
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11.5px] text-text-2 leading-snug">
                        {meta.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 px-6 py-4 border-t border-border-default bg-bg-1">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-[12px] text-text-3">
            {templateCards.find((m) => m.id === selected)?.name} selected
          </p>
          <button
            type="button"
            onClick={() => void applySelected()}
            className="px-5 py-2.5 rounded-xl bg-text-0 text-bg-0 text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            Use this design
          </button>
        </div>
      </div>
    </div>
  )
}
