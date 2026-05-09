import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface DocsDialActions {
  removeSavedStream: (id: string) => void
  saveStream: (stream: Omit<SavedStream, "id">) => void
  setAutoplay: (autoplay: boolean) => void
  setCustomConfig: (config: string) => void
  setCustomSrc: (src: string) => void
  setMuted: (muted: boolean) => void
  setPresetId: (id: string) => void
  setVolume: (volume: number) => void
}

export interface DocsDialState {
  autoplay: boolean
  customConfig: string
  customSrc: string
  muted: boolean
  presetId: string
  savedStreams: SavedStream[]
  volume: number
}

export type DocsDialStore = DocsDialActions & DocsDialState

export interface SavedStream {
  config?: string
  id: string
  name: string
  src: string
}

export const useDocsDialStore = create<DocsDialStore>()(
  persist(
    (set) => ({
      autoplay: false,
      customConfig: "",
      customSrc: "",
      muted: true,
      presetId: "mux-big-buck-bunny",
      removeSavedStream: (id) =>
        set((state) => ({
          savedStreams: state.savedStreams.filter((s) => s.id !== id),
        })),
      savedStreams: [],
      saveStream: (stream) =>
        set((state) => ({
          savedStreams: [
            ...state.savedStreams,
            { ...stream, id: crypto.randomUUID() },
          ],
        })),
      setAutoplay: (autoplay) => set({ autoplay }),

      setCustomConfig: (customConfig) => set({ customConfig }),
      setCustomSrc: (customSrc) => set({ customSrc }),
      setMuted: (muted) => set({ muted }),
      setPresetId: (presetId) => set({ presetId }),
      setVolume: (volume) => set({ volume }),
      volume: 80,
    }),
    {
      name: "limeplay-docs-dial",
    }
  )
)
