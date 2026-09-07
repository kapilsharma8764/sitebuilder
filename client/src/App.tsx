import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from './layout/ErrorBoundary'
import { AppLayout } from './layout/AppLayout'
import { Landing } from './routes/Landing'
import { SignIn } from './routes/SignIn'
import { useAuthStore } from './store/authStore'
import { CreateWebsite } from './routes/CreateWebsite'
import { Describe } from './routes/Describe'
import { Templates } from './routes/Templates'
import { Dashboard } from './routes/Dashboard'
import { Leads } from './routes/Leads'
import { Editor } from './routes/Editor'
import { Components } from './routes/Components'
import { Settings } from './routes/Settings'
import { NotFound } from './routes/NotFound'
import { useKeyboardShortcuts } from './lib/useKeyboardShortcuts'

/**
 * Keeps the app behind an account.
 *
 * Sites, enquiries and everything else belong to somebody, so there is nothing
 * useful to show before signing in. The sign-in screen itself sits outside.
 */
function RequireAccount({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/sign-in" replace />
  return children
}

function AppRoutes() {
  useKeyboardShortcuts()

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="sign-in" element={<SignIn />} />
        <Route index element={<RequireAccount><Landing /></RequireAccount>} />
        <Route path="create" element={<RequireAccount><CreateWebsite /></RequireAccount>} />
        <Route path="describe" element={<RequireAccount><Describe /></RequireAccount>} />
        <Route path="templates" element={<RequireAccount><Templates /></RequireAccount>} />
        <Route path="dashboard" element={<RequireAccount><Dashboard /></RequireAccount>} />
        <Route path="leads" element={<RequireAccount><Leads /></RequireAccount>} />
        <Route path="new" element={<Navigate to="/create" replace />} />
        <Route path="editor" element={<RequireAccount><Editor /></RequireAccount>} />
        <Route path="components" element={<Components />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
