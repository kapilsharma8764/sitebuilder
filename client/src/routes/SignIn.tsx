import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { api, ApiError } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

/**
 * Signing in, and signing up.
 *
 * One screen for both, because on a fresh install the first thing anyone does
 * is create an account, and asking them to find a separate page for it is a
 * pointless extra step.
 */

const inputClass =
  'w-full px-3 py-2.5 rounded-xl border border-border-default bg-bg-2 text-text-0 text-[13px] outline-none focus:border-brand placeholder:text-text-3 transition-colors'

export function SignIn() {
  const navigate = useNavigate()
  const signIn = useAuthStore((s) => s.signIn)

  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const creating = mode === 'up'

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = creating
        ? await api.register({ email, password, name })
        : await api.login({ email, password })

      signIn(result.token, result.user)
      toast(creating ? 'Account created' : `Welcome back${result.user.name ? `, ${result.user.name}` : ''}`)
      navigate('/')
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-sm mx-auto px-6 py-20">
        <h1 className="text-2xl font-bold tracking-tight text-text-0 font-display">
          {creating ? 'Create your account' : 'Sign in'}
        </h1>
        <p className="mt-2 text-[12.5px] text-text-2 leading-relaxed">
          {creating
            ? 'Your sites and enquiries are kept under this account.'
            : 'Welcome back — pick up where you left off.'}
        </p>

        <form onSubmit={submit} className="mt-7 flex flex-col gap-4">
          {creating && (
            <div>
              <label className="block text-[12px] text-text-1 mb-1.5 font-medium" htmlFor="name">
                Your name
              </label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className="block text-[12px] text-text-1 mb-1.5 font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[12px] text-text-1 mb-1.5 font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={creating ? 'new-password' : 'current-password'}
              className={inputClass}
            />
            {creating && (
              <p className="mt-1 text-[11px] text-text-3">At least 8 characters.</p>
            )}
          </div>

          {error && <p className="text-[12.5px] text-status-red">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 h-10 rounded-xl bg-text-0 text-bg-0 text-[13px] font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
          >
            {busy && <Loader2 size={14} className="animate-spin" />}
            {creating ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center text-[12.5px] text-text-3">
          {creating ? 'Already have an account?' : 'New here?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(creating ? 'in' : 'up')
              setError('')
            }}
            className="text-brand hover:text-brand-dim transition-colors"
          >
            {creating ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  )
}
