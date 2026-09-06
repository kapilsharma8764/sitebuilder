import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LayoutTemplate, Sparkles, Wand2 } from 'lucide-react'
import { useBusinessStore } from '@/store/businessStore'

/**
 * The first screen. Two ways in, both landing on the same details form.
 */
export function Landing() {
  const navigate = useNavigate()
  const reset = useBusinessStore((s) => s.reset)
  const completed = useBusinessStore((s) => s.completed)
  const businessName = useBusinessStore((s) => s.profile.name)

  function startFresh() {
    reset()
    navigate('/create')
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg-2 border border-border-default text-[11px] text-text-2">
            <Sparkles size={11} className="text-brand" />
            No coding needed
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-text-0 font-display">
            Build your website
            <br />
            <span className="bg-gradient-to-r from-brand to-brand-2 bg-clip-text text-transparent">
              in fifteen minutes
            </span>
          </h1>

          <p className="mt-5 max-w-xl mx-auto text-text-2 leading-relaxed">
            Answer a few questions about your business, pick a design, then drag the
            pieces into place. Publish when it looks right.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <button
            type="button"
            onClick={startFresh}
            className="group text-left p-7 rounded-2xl bg-bg-2 border border-border-default hover:border-brand hover:bg-bg-3 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-brand/12 border border-brand/25 grid place-items-center">
              <LayoutTemplate size={17} className="text-brand" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-text-0">Create website</h2>
            <p className="mt-1.5 text-[12.5px] text-text-2 leading-relaxed">
              Tell us about your business, then choose from ready-made designs and
              edit them yourself.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-brand">
              Start
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>

          <div className="text-left p-7 rounded-2xl bg-bg-2 border border-border-default opacity-60">
            <div className="w-10 h-10 rounded-xl bg-bg-4 border border-border-default grid place-items-center">
              <Wand2 size={17} className="text-text-2" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-text-1">Describe it to AI</h2>
            <p className="mt-1.5 text-[12.5px] text-text-3 leading-relaxed">
              Write what your website should say and have a first draft written for
              you.
            </p>
            <span className="mt-4 inline-block text-[11px] text-text-3">Coming next</span>
          </div>
        </div>

        {completed && (
          <div className="mt-10 flex items-center justify-center gap-3 text-[12.5px]">
            <span className="text-text-3">
              You already started {businessName ? `“${businessName}”` : 'a website'}.
            </span>
            <Link to="/editor" className="text-brand hover:text-brand-dim transition-colors">
              Open the editor
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
