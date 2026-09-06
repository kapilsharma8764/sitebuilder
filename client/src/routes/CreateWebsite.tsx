import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ImageOff } from 'lucide-react'
import { useBusinessStore } from '@/store/businessStore'
import {
  audienceOptions,
  categoryOptions,
  offerOptions,
  isProfileComplete,
} from '@/onboarding/profile'

/**
 * The Create Website flow: what kind of website, then the business details,
 * then how to reach the business. Templates come after this, because the
 * answers here decide which templates are worth showing.
 *
 * Four short steps rather than one long form. A single page with fourteen
 * inputs reads as work; four pages with three or four each read as progress.
 */

const STEPS = ['Type of website', 'Who you sell to', 'Your business', 'Contact details']

const inputClass =
  'w-full px-3 py-2.5 rounded-xl border border-border-default bg-bg-2 text-text-0 text-[13px] outline-none focus:border-brand placeholder:text-text-3 transition-colors'

const labelClass = 'block text-[12px] text-text-1 mb-1.5 font-medium'

function Choice({
  label,
  hint,
  selected,
  onSelect,
}: {
  label: string
  hint: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative text-left p-4 rounded-xl border transition-all ${
        selected
          ? 'border-brand bg-brand/10'
          : 'border-border-default bg-bg-2 hover:border-border-hover hover:bg-bg-3'
      }`}
    >
      {selected && (
        <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-brand grid place-items-center">
          <Check size={10} className="text-white" />
        </span>
      )}
      <span className="block text-[13px] font-semibold text-text-0">{label}</span>
      <span className="block mt-0.5 text-[11.5px] text-text-2 leading-snug">{hint}</span>
    </button>
  )
}

function LogoInput({
  label,
  help,
  value,
  onChange,
  square,
}: {
  label: string
  help: string
  value: string
  onChange: (v: string) => void
  square?: boolean
}) {
  const [broken, setBroken] = useState(false)

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex gap-3">
        <div
          className={`shrink-0 rounded-xl border border-border-default bg-bg-2 overflow-hidden grid place-items-center ${
            square ? 'w-14 h-14' : 'w-24 h-14'
          }`}
        >
          {value && !broken ? (
            <img
              src={value}
              alt=""
              className="w-full h-full object-contain"
              onError={() => setBroken(true)}
              onLoad={() => setBroken(false)}
            />
          ) : (
            <ImageOff size={15} className="text-text-3" />
          )}
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={value}
            placeholder="Paste an image link"
            onChange={(e) => {
              setBroken(false)
              onChange(e.target.value)
            }}
            className={inputClass}
          />
          <p className="mt-1 text-[11px] text-text-3 leading-snug">{help}</p>
        </div>
      </div>
    </div>
  )
}

export function CreateWebsite() {
  const navigate = useNavigate()
  const profile = useBusinessStore((s) => s.profile)
  const update = useBusinessStore((s) => s.update)
  const updateContact = useBusinessStore((s) => s.updateContact)
  const complete = useBusinessStore((s) => s.complete)

  const [step, setStep] = useState(0)

  // Each step names what it needs before the user can move on. Keeping this in
  // one place means the button state and the step never disagree.
  const canContinue = [
    profile.category !== null && (profile.category === 'education' || profile.offer !== null),
    profile.audience !== null,
    profile.name.trim().length > 0,
    true,
  ][step]

  function back() {
    if (step === 0) navigate('/')
    else setStep(step - 1)
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
      return
    }
    complete()
    navigate('/templates')
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center gap-1.5 mb-2">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-brand' : 'bg-bg-4'
              }`}
            />
          ))}
        </div>
        <p className="text-[11.5px] text-text-3">
          Step {step + 1} of {STEPS.length}
        </p>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-text-0 font-display">
          {STEPS[step]}
        </h1>

        <div className="mt-7">
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {categoryOptions.map((option) => (
                  <Choice
                    key={option.value}
                    label={option.label}
                    hint={option.hint}
                    selected={profile.category === option.value}
                    onSelect={() =>
                      update({
                        category: option.value,
                        offer: option.value === 'education' ? null : profile.offer,
                      })
                    }
                  />
                ))}
              </div>

              {profile.category && profile.category !== 'education' && (
                <div>
                  <p className={labelClass}>What do you offer?</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {offerOptions.map((option) => (
                      <Choice
                        key={option.value}
                        label={option.label}
                        hint={option.hint}
                        selected={profile.offer === option.value}
                        onSelect={() => update({ offer: option.value })}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-3 sm:grid-cols-3">
              {audienceOptions.map((option) => (
                <Choice
                  key={option.value}
                  label={option.label}
                  hint={option.hint}
                  selected={profile.audience === option.value}
                  onSelect={() => update({ audience: option.value })}
                />
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <label className={labelClass} htmlFor="business-name">
                  Business name
                </label>
                <input
                  id="business-name"
                  type="text"
                  value={profile.name}
                  placeholder="Sharma Coaching Classes"
                  onChange={(e) => update({ name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <LogoInput
                label="Logo"
                help="Shown in the header. A transparent PNG looks best."
                value={profile.logo}
                onChange={(logo) => update({ logo })}
              />

              <LogoInput
                label="Square logo"
                help="Optional. Used for the browser tab icon."
                value={profile.logoSquare}
                onChange={(logoSquare) => update({ logoSquare })}
                square
              />

              <div>
                <label className={labelClass} htmlFor="slogan">
                  Slogan
                </label>
                <input
                  id="slogan"
                  type="text"
                  value={profile.slogan}
                  placeholder="Learning that lasts"
                  onChange={(e) => update({ slogan: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="about">
                  About the business
                </label>
                <textarea
                  id="about"
                  rows={4}
                  value={profile.about}
                  placeholder="A few lines about what you do and who you do it for."
                  onChange={(e) => update({ about: e.target.value })}
                  className={`${inputClass} resize-y leading-relaxed`}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div>
                <label className={labelClass} htmlFor="mobile">
                  Mobile number
                </label>
                <input
                  id="mobile"
                  type="tel"
                  value={profile.contact.mobile}
                  placeholder="98765 43210"
                  onChange={(e) => updateContact({ mobile: e.target.value })}
                  className={inputClass}
                />
                <label className="mt-2 flex items-center gap-2 text-[12px] text-text-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={profile.contact.whatsapp}
                    onChange={(e) => updateContact({ whatsapp: e.target.checked })}
                    className="accent-brand"
                  />
                  This number is on WhatsApp
                  <span className="text-text-3">— adds a chat button to the site</span>
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="alt-mobile">
                    Second number
                  </label>
                  <input
                    id="alt-mobile"
                    type="tel"
                    value={profile.contact.altMobile}
                    onChange={(e) => updateContact({ altMobile: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profile.contact.email}
                    placeholder="hello@business.com"
                    onChange={(e) => updateContact({ email: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="address">
                  Address
                </label>
                <textarea
                  id="address"
                  rows={2}
                  value={profile.contact.address}
                  onChange={(e) => updateContact({ address: e.target.value })}
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="map">
                    Google Maps link
                  </label>
                  <input
                    id="map"
                    type="url"
                    value={profile.contact.mapUrl}
                    placeholder="https://maps.google.com/…"
                    onChange={(e) => updateContact({ mapUrl: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="timing">
                    Opening hours
                  </label>
                  <input
                    id="timing"
                    type="text"
                    value={profile.contact.officeTiming}
                    placeholder="Mon–Sat, 9 AM – 7 PM"
                    onChange={(e) => updateContact({ officeTiming: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <p className="text-[11.5px] text-text-3 leading-relaxed">
                Everything on this page is optional, and all of it can be changed later
                from the editor.
              </p>
            </div>
          )}
        </div>

        <div className="mt-9 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] text-text-2 hover:text-text-0 hover:bg-bg-2 transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <button
            type="button"
            onClick={next}
            disabled={!canContinue}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-text-0 text-bg-0 text-[13px] font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
          >
            {step === STEPS.length - 1 ? 'Choose a design' : 'Continue'}
            <ArrowRight size={14} />
          </button>
        </div>

        {step === STEPS.length - 1 && !isProfileComplete(profile) && (
          <p className="mt-3 text-right text-[11.5px] text-status-yellow">
            Add a business name on the previous step first.
          </p>
        )}
      </div>
    </div>
  )
}
