import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { FolderOpen } from 'lucide-react'
import { CanvasToolbar } from './CanvasToolbar'
import { LeftSidebar } from './LeftSidebar'
import { Canvas } from './Canvas'
import { RightSidebar } from './RightSidebar'
import { BuilderDndContext } from '@/builder/BuilderDndContext'
import { JsonDrawer } from './JsonDrawer'
import { VersionHistory } from './VersionHistory'
import { GenerationOverlay } from './GenerationOverlay'
import { useConfigStore } from '@/store/configStore'
import { useEditorStore } from '@/store/editorStore'
import { useProjectsStore } from '@/store/projectsStore'
import { generateSiteConfig } from '@/lib/generate-site'

function useGenerationOrchestration() {
  const isGenerating = useEditorStore((s) => s.isGenerating)
  const generationPrompt = useEditorStore((s) => s.generationPrompt)
  const clearGeneration = useEditorStore((s) => s.clearGeneration)
  const setGenerationError = useEditorStore((s) => s.setGenerationError)
  const activeProjectId = useEditorStore((s) => s.activeProjectId)
  const setConfig = useConfigStore((s) => s.setConfig)
  const updateProjectConfig = useProjectsStore((s) => s.updateProjectConfig)
  const renameProject = useProjectsStore((s) => s.renameProject)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!isGenerating || !generationPrompt) return

    const controller = new AbortController()
    abortRef.current = controller

    // Timeout after 30s to prevent infinite loading
    const timeout = setTimeout(() => {
      controller.abort()
      setGenerationError('Generation timed out')
      toast.error('Generation timed out. Try again or add a Gemini API key in Settings.')
      clearGeneration()
    }, 30000)

    generateSiteConfig(generationPrompt, controller.signal)
      .then(({ config, source }) => {
        clearTimeout(timeout)
        if (controller.signal.aborted) return
        setConfig(config)
        if (activeProjectId) {
          updateProjectConfig(activeProjectId, config)
          if (config.name) renameProject(activeProjectId, config.name)
        }
        clearGeneration()
        if (source === 'template') {
          toast('Generated from template. Add a Gemini API key in Settings for AI generation.')
        }
      })
      .catch((err) => {
        clearTimeout(timeout)
        if (err instanceof Error && err.name === 'AbortError') return
        setGenerationError(err instanceof Error ? err.message : 'Generation failed')
        toast.error(err instanceof Error ? err.message : 'Generation failed')
        clearGeneration()
      })

    return () => {
      clearTimeout(timeout)
      controller.abort()
      abortRef.current = null
    }
  }, [isGenerating, generationPrompt]) // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Shown when there is no site to edit yet.
 *
 * The editor used to key off a "project" record that only the old dashboard
 * created, so arriving here straight from the template gallery showed this
 * screen instead of the site the person had just chosen. It now asks the one
 * question that matters: are there any sections to draw?
 */
function EditorEmptyState() {
  const navigate = useNavigate()

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center text-center px-6 max-w-sm">
        <div className="w-12 h-12 rounded-xl bg-bg-3 border border-border-default flex items-center justify-center mb-4">
          <FolderOpen size={20} className="text-text-3" />
        </div>
        <h2 className="text-[16px] font-display font-semibold text-text-1 mb-1">
          Nothing to edit yet
        </h2>
        <p className="text-text-2 text-[13px] mb-6 leading-relaxed">
          Answer a few questions about your business and pick a design, and it opens
          here ready to change.
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/create')}
            className="px-5 py-2 rounded-xl bg-text-0 text-bg-0 text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            Create a website
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-xl border border-border-default text-text-2 text-[13px] hover:text-text-0 hover:bg-bg-2 transition-colors"
          >
            Your sites
          </button>
        </div>
      </div>
    </div>
  )
}


export function EditorLayout() {
  useGenerationOrchestration()
  const previewMode = useEditorStore((s) => s.previewMode)
  const hasSomething = useConfigStore(
    (s) =>
      s.config.blocks.length > 0 ||
      (s.config.header?.length ?? 0) > 0 ||
      (s.config.pages?.some((page) => page.blocks.length > 0) ?? false),
  )

  if (!hasSomething) {
    return <EditorEmptyState />
  }

  return (
    <BuilderDndContext>
    <div className="h-full flex flex-col relative">
      <div className="flex-1 flex overflow-hidden">
        {!previewMode && <LeftSidebar />}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <CanvasToolbar />
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <Canvas />
            <JsonDrawer />
            <GenerationOverlay />
          </div>
        </div>
        {!previewMode && <RightSidebar />}
      </div>
      <VersionHistory />
    </div>
    </BuilderDndContext>
  )
}
