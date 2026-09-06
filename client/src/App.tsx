import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from './layout/ErrorBoundary'
import { AppLayout } from './layout/AppLayout'
import { Landing } from './routes/Landing'
import { CreateWebsite } from './routes/CreateWebsite'
import { Templates } from './routes/Templates'
import { Dashboard } from './routes/Dashboard'
import { Leads } from './routes/Leads'
import { Editor } from './routes/Editor'
import { Components } from './routes/Components'
import { Settings } from './routes/Settings'
import { NotFound } from './routes/NotFound'
import { useKeyboardShortcuts } from './lib/useKeyboardShortcuts'

function AppRoutes() {
  useKeyboardShortcuts()

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Landing />} />
        <Route path="create" element={<CreateWebsite />} />
        <Route path="templates" element={<Templates />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="new" element={<Navigate to="/create" replace />} />
        <Route path="editor" element={<Editor />} />
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
