import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface SavedStream {
  config?: string
  id: string
  name: string
  src: string
}

export interface StreamPanelActions {
  removeSavedStream: (id: string) => void
  saveStream: (stream: Omit<SavedStream, "id">) => void
  setAutoplay: (autoplay: boolean) => void
  setContentSelection: (
    playerType: StreamPanelPlayerType,
    selection: StreamPanelSelection
  ) => void
  setCustomConfig: (config: string) => void
  setCustomSrc: (src: string) => void
  setMuted: (muted: boolean) => void
  setPresetId: (id: string) => void
  setVolume: (volume: number) => void
}
export type StreamPanelContentKind = "live" | "playlist" | "stream"

export type StreamPanelPlayerType = "audio" | "video"

export interface StreamPanelSelection {
  id: string
  kind: StreamPanelContentKind
}

export interface StreamPanelState {
  autoplay: boolean
  contentSelections: Partial<Record<StreamPanelPlayerType, StreamPanelSelection>>
  customConfig: string
  customSrc: string
  muted: boolean
  presetId: string
  savedStreams: SavedStream[]
  volume: number
}

export type StreamPanelStore = StreamPanelActions & StreamPanelState

export const useStreamPanelStore = create<StreamPanelStore>()(
  persist(
    (set) => ({
      autoplay: false,
      contentSelections: {},
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
      setContentSelection: (playerType, selection) =>
        set((state) => ({
          contentSelections: {
            ...state.contentSelections,
            [playerType]: selection,
          },
        })),

      setCustomConfig: (customConfig) => set({ customConfig }),
      setCustomSrc: (customSrc) => set({ customSrc }),
      setMuted: (muted) => set({ muted }),
      setPresetId: (presetId) => set({ presetId }),
      setVolume: (volume) => set({ volume }),
      volume: 80,
    }),
    {
      // Keep the original key so existing saved streams and preferences survive the rename.
      name: "limeplay-docs-dial",
    }
  )
)
