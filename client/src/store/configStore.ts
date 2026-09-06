import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'
import type { BlockConfig, SiteConfig, ThemeConfig, PageConfig, SiteRegion } from '@/blocks/types'
import { newId } from '@/lib/id'
import {
  ensurePages,
  mutateRegion,
  pathFromName,
  regionBlocks,
  regionOfBlock,
  splitHeaderFooter,
  syncMenu,
} from './site-shape'

interface UndoEntry {
  header?: BlockConfig[]
  footer?: BlockConfig[]
  pages?: PageConfig[]
  blocks: BlockConfig[]
  theme?: Partial<ThemeConfig>
  label: string
  timestamp: number
}

interface ConfigState {
  config: SiteConfig
  activePageId: string
  /** Header, footer, or the page currently open. */
  activeRegion: SiteRegion
  undoStack: UndoEntry[]
  redoStack: UndoEntry[]
  setConfig: (config: SiteConfig) => void
  setActivePage: (id: string) => void
  setActiveRegion: (region: SiteRegion) => void
  getActivePageBlocks: () => BlockConfig[]
  updateBlock: (id: string, updates: Partial<BlockConfig>) => void
  updateBlockProps: (id: string, props: Record<string, unknown>) => void
  addBlock: (block: BlockConfig, index?: number) => void
  removeBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  moveBlock: (fromIndex: number, toIndex: number) => void
  addPage: (name: string, showInMenu?: boolean) => string
  removePage: (id: string) => void
  renamePage: (id: string, name: string) => void
  setPageInMenu: (id: string, showInMenu: boolean) => void
  setTheme: (theme: Partial<ThemeConfig>) => void
  updateTheme: (partial: Partial<ThemeConfig>) => void
  previewTheme: (partial: Partial<ThemeConfig>) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

const defaultBlocks: BlockConfig[] = [
  {
    id: 'block-navbar',
    type: 'navbar',
    variant: 'default',
    props: {
      logo: 'Acme Inc',
      links: ['Features', 'Pricing', 'About', 'Contact'],
      ctaText: 'Get Started',
    },
  },
  {
    id: 'block-hero',
    type: 'hero',
    variant: 'centered',
    props: {
      badge: 'Now in Beta',
      headline: 'Build websites with JSON',
      subheadline: 'The visual editor that agents and humans both understand. Structured config, beautiful output.',
      primaryCta: 'Start Building',
      secondaryCta: 'View Demo',
    },
  },
  {
    id: 'block-features',
    type: 'features',
    variant: 'grid',
    props: {
      label: 'Features',
      title: 'Everything you need',
      subtitle: 'Powerful building blocks for your next website',
      items: [
        { icon: 'Blocks', title: 'Visual Editor', description: 'Drag and drop blocks to build your layout' },
        { icon: 'Code', title: 'JSON Config', description: 'Every change is a clean JSON mutation' },
        { icon: 'Bot', title: 'Agent Ready', description: 'AI agents can read and write your config' },
      ],
    },
  },
  {
    id: 'block-cta',
    type: 'cta',
    variant: 'simple',
    props: {
      headline: 'Ready to get started?',
      subheadline: 'Create your first site in minutes.',
      buttonText: 'Start Free',
    },
  },
  {
    id: 'block-footer',
    type: 'footer',
    variant: 'simple',
    props: {
      logo: 'SiteBuilder',
      copyright: '2026 SiteBuilder. All rights reserved.',
      links: ['Privacy', 'Terms', 'Contact'],
    },
  },
]

export const defaultConfig: SiteConfig = {
  name: 'My Website',
  pages: [{ id: 'page-home', name: 'Home', path: '/', blocks: defaultBlocks }],
  blocks: defaultBlocks,
}

type Snapshot = Omit<UndoEntry, 'label' | 'timestamp'>

function copy<T>(value: T | undefined): T | undefined {
  return value === undefined ? undefined : (JSON.parse(JSON.stringify(value)) as T)
}

function snapshot(state: ConfigState): Snapshot {
  return {
    header: copy(state.config.header),
    footer: copy(state.config.footer),
    pages: copy(state.config.pages),
    blocks: JSON.parse(JSON.stringify(state.config.blocks)),
    theme: copy(state.config.theme),
  }
}

const MAX_UNDO = 50

function pushUndo(state: ConfigState, label: string): Partial<ConfigState> {
  const snap = snapshot(state)
  return {
    undoStack: [...state.undoStack, { ...snap, label, timestamp: Date.now() }].slice(-MAX_UNDO),
    redoStack: [],
  }
}

function withPages(config: SiteConfig): SiteConfig {
  return { ...config, pages: ensurePages(config) }
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      config: splitHeaderFooter(defaultConfig),
      activePageId: 'page-home',
      activeRegion: 'page',
      undoStack: [],
      redoStack: [],

      setConfig: (config) => {
        const shaped = syncMenu(splitHeaderFooter(config))
        set({
          config: shaped,
          activePageId: ensurePages(shaped)[0]?.id ?? 'page-home',
          activeRegion: 'page',
          undoStack: [],
          redoStack: [],
        })
      },

      setActivePage: (id) => set({ activePageId: id, activeRegion: 'page' }),

      setActiveRegion: (region) => set({ activeRegion: region }),

      getActivePageBlocks: () => {
        const state = get()
        return regionBlocks(state.config, 'page', state.activePageId)
      },

      updateBlock: (id, updates) =>
        set((state) => ({
          ...pushUndo(state, 'Update block'),
          config: mutateRegion(
            withPages(state.config),
            regionOfBlock(state.config, id, state.activePageId),
            state.activePageId,
            (blocks) => blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
          ),
        })),

      updateBlockProps: (id, props) =>
        set((state) => ({
          ...pushUndo(state, 'Update properties'),
          config: mutateRegion(
            withPages(state.config),
            regionOfBlock(state.config, id, state.activePageId),
            state.activePageId,
            (blocks) =>
              blocks.map((b) => (b.id === id ? { ...b, props: { ...b.props, ...props } } : b)),
          ),
        })),

      addBlock: (block, index) =>
        set((state) => ({
          ...pushUndo(state, 'Add block'),
          config: mutateRegion(withPages(state.config), state.activeRegion, state.activePageId, (blocks) => {
            if (index !== undefined) {
              blocks.splice(index, 0, block)
            } else {
              blocks.push(block)
            }
            return blocks
          }),
        })),

      removeBlock: (id) =>
        set((state) => ({
          ...pushUndo(state, 'Remove block'),
          config: mutateRegion(
            withPages(state.config),
            regionOfBlock(state.config, id, state.activePageId),
            state.activePageId,
            (blocks) => blocks.filter((b) => b.id !== id),
          ),
        })),

      duplicateBlock: (id) =>
        set((state) => {
          const region = regionOfBlock(state.config, id, state.activePageId)
          const blocks = regionBlocks(state.config, region, state.activePageId)
          const idx = blocks.findIndex((b) => b.id === id)
          if (idx === -1) return state
          const original = blocks[idx]
          const clone: BlockConfig = {
            ...JSON.parse(JSON.stringify(original)),
            id: newId('block'),
          }
          return {
            ...pushUndo(state, 'Duplicate block'),
            config: mutateRegion(withPages(state.config), region, state.activePageId, (b) => {
              b.splice(idx + 1, 0, clone)
              return b
            }),
          }
        }),

      moveBlock: (fromIndex, toIndex) =>
        set((state) => ({
          ...pushUndo(state, 'Move block'),
          config: mutateRegion(withPages(state.config), state.activeRegion, state.activePageId, (blocks) => {
            const [moved] = blocks.splice(fromIndex, 1)
            blocks.splice(toIndex, 0, moved)
            return blocks
          }),
        })),

      addPage: (name, showInMenu = true) => {
        const id = newId('page')
        set((state) => ({
          ...pushUndo(state, 'Add page'),
          config: syncMenu(
            produce(withPages(state.config), (draft) => {
              draft.pages!.push({
                id,
                name,
                path: pathFromName(name),
                blocks: [],
                showInMenu,
              })
            }),
          ),
          activePageId: id,
          activeRegion: 'page',
        }))
        return id
      },

      removePage: (id) =>
        set((state) => {
          const pages = ensurePages(state.config)
          // A site always has at least one page; removing the last one would
          // leave the editor with nothing to draw.
          if (pages.length <= 1) return state
          const remaining = pages.filter((p) => p.id !== id)
          const activePageId = state.activePageId === id ? remaining[0].id : state.activePageId
          const active = remaining.find((p) => p.id === activePageId) ?? remaining[0]
          return {
            ...pushUndo(state, 'Remove page'),
            config: syncMenu({ ...state.config, pages: remaining, blocks: active.blocks }),
            activePageId,
          }
        }),

      renamePage: (id, name) =>
        set((state) => ({
          ...pushUndo(state, 'Rename page'),
          config: syncMenu(
            produce(withPages(state.config), (draft) => {
              const page = draft.pages!.find((p) => p.id === id)
              if (!page) return
              page.name = name
              page.path = pathFromName(name)
            }),
          ),
        })),

      setPageInMenu: (id, showInMenu) =>
        set((state) => ({
          config: syncMenu(
            produce(withPages(state.config), (draft) => {
              const page = draft.pages!.find((p) => p.id === id)
              if (page) page.showInMenu = showInMenu
            }),
          ),
        })),

      setTheme: (theme) =>
        set((state) => ({
          ...pushUndo(state, 'Change theme'),
          config: { ...state.config, theme },
        })),

      updateTheme: (partial) =>
        set((state) => ({
          ...pushUndo(state, 'Update theme'),
          config: { ...state.config, theme: { ...state.config.theme, ...partial } },
        })),

      previewTheme: (partial) =>
        set((state) => ({
          config: { ...state.config, theme: { ...state.config.theme, ...partial } },
        })),

      undo: () =>
        set((state) => {
          if (state.undoStack.length === 0) return state
          const prev = state.undoStack[state.undoStack.length - 1]
          const snap = snapshot(state)
          return {
            undoStack: state.undoStack.slice(0, -1),
            redoStack: [...state.redoStack, { ...snap, label: prev.label, timestamp: Date.now() }],
            config: {
              ...state.config,
              header: prev.header,
              footer: prev.footer,
              pages: prev.pages,
              blocks: prev.blocks,
              theme: prev.theme,
            },
          }
        }),

      redo: () =>
        set((state) => {
          if (state.redoStack.length === 0) return state
          const next = state.redoStack[state.redoStack.length - 1]
          const snap = snapshot(state)
          return {
            redoStack: state.redoStack.slice(0, -1),
            undoStack: [...state.undoStack, { ...snap, label: next.label, timestamp: Date.now() }],
            config: {
              ...state.config,
              header: next.header,
              footer: next.footer,
              pages: next.pages,
              blocks: next.blocks,
              theme: next.theme,
            },
          }
        }),

      canUndo: () => get().undoStack.length > 0,
      canRedo: () => get().redoStack.length > 0,
    }),
    {
      name: 'sitebuilder-config',
      version: 3,
      partialize: (state) => ({
        config: state.config,
        activePageId: state.activePageId,
        activeRegion: state.activeRegion,
      }),
      migrate: (persisted, version) => {
        const data = persisted as Record<string, unknown>
        const config = data.config as SiteConfig | undefined

        if (config && !config.pages) {
          // v0/v1 -> v2: wrap blocks[] into pages[]
          config.pages = [{ id: 'page-home', name: 'Home', path: '/', blocks: config.blocks || [] }]
          data.activePageId = 'page-home'
        }

        if (config && version !== 3) {
          // v2 -> v3: lift the navbar and footer out of the page so one header
          // serves every page.
          data.config = syncMenu(splitHeaderFooter(config))
        }

        data.activeRegion = 'page'
        return data
      },
    }
  )
)
