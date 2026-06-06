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
  setHasHydrated: (hasHydrated: boolean) => void
  setMuted: (muted: boolean) => void
  setVolume: (volume: number) => void
}
export type StreamPanelContentKind = "live" | "playlist" | "stream"

export type StreamPanelPlayerType = "audio" | "video"

export interface StreamPanelSelection {
  config?: string
  id: string
  index?: number
  kind: StreamPanelContentKind
  src?: string
}

export interface StreamPanelState {
  autoplay: boolean
  contentSelections: Partial<
    Record<StreamPanelPlayerType, StreamPanelSelection>
  >
  customConfig: string
  customSrc: string
  hasHydrated: boolean
  muted: boolean
  savedStreams: SavedStream[]
  volume: number
}

export type StreamPanelStore = StreamPanelActions & StreamPanelState

type PersistedStreamPanelState = Pick<
  StreamPanelState,
  "autoplay" | "contentSelections" | "muted" | "savedStreams" | "volume"
>

function stripTransientState(
  state: unknown
): Partial<PersistedStreamPanelState> {
  if (!state || typeof state !== "object") return {}

  const { autoplay, contentSelections, muted, savedStreams, volume } =
    state as Partial<PersistedStreamPanelState>

  const persistedState: Partial<PersistedStreamPanelState> = {}

  if (autoplay !== undefined) persistedState.autoplay = autoplay
  if (contentSelections !== undefined) {
    persistedState.contentSelections = contentSelections
  }
  if (muted !== undefined) persistedState.muted = muted
  if (savedStreams !== undefined) persistedState.savedStreams = savedStreams
  if (volume !== undefined) persistedState.volume = volume

  return persistedState
}

export const useStreamPanelStore = create<StreamPanelStore>()(
  persist(
    (set) => ({
      autoplay: false,
      contentSelections: {},
      customConfig: "",
      customSrc: "",
      hasHydrated: false,
      muted: true,
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
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setMuted: (muted) => set({ muted }),
      setVolume: (volume) => set({ volume }),
      volume: 80,
    }),
    {
      // Keep the original key so existing saved streams and preferences survive the rename.
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...stripTransientState(persistedState),
      }),
      migrate: stripTransientState,
      name: "limeplay-docs-dial",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      partialize: (state) => ({
        autoplay: state.autoplay,
        contentSelections: state.contentSelections,
        muted: state.muted,
        savedStreams: state.savedStreams,
        volume: state.volume,
      }),
      version: 1,
    }
  )
)

export function useStreamPanelStoreHydrated() {
  return useStreamPanelStore((state) => state.hasHydrated)
}
