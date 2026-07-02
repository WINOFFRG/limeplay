import type {
  StreamPanelContentKind,
  StreamPanelPlayerType,
} from "@/components/stream-panel/use-stream-panel"
import type { CatalogPlaylistPreset } from "@/lib/catalogs"
import type { StreamPreset } from "@/lib/stream-presets"

export const STREAM_PANEL_OVERLAY = {
  CONTENT: "content",
  CUSTOM: "custom",
  LIVE: "live",
  NONE: "none",
  PLAYLISTS: "playlists",
  SAVED: "saved",
  STREAMS: "streams",
} as const

export type StreamPanelOverlay =
  (typeof STREAM_PANEL_OVERLAY)[keyof typeof STREAM_PANEL_OVERLAY]

export const STREAM_PANEL_POSITION_CLASSES = {
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-10 right-4",
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
} as const

export type PanelPosition = keyof typeof STREAM_PANEL_POSITION_CLASSES

export const STREAM_PANEL_ORIGIN_CLASSES = {
  "bottom-left": "origin-bottom-left",
  "bottom-right": "origin-bottom-right",
  "top-left": "origin-top-left",
  "top-right": "origin-top-right",
} satisfies Record<PanelPosition, string>

export const STREAM_PANEL_CONTENT_OVERLAYS = {
  live: STREAM_PANEL_OVERLAY.LIVE,
  playlist: STREAM_PANEL_OVERLAY.PLAYLISTS,
  stream: STREAM_PANEL_OVERLAY.STREAMS,
} satisfies Record<StreamPanelContentKind, StreamPanelOverlay>

export const STREAM_PANEL_EMPTY_CONTENT_LABEL = "Choose content"

export interface StreamPanelProps {
  align?: "center" | "end" | "start"
  onLoadStream?: (src: string, config?: string) => void
  onPlaylistChange?: (playlist: CatalogPlaylistPreset) => void
  onPresetChange?: (
    preset: StreamPreset,
    kind?: Extract<StreamPanelContentKind, "live" | "stream">
  ) => void
  playerType?: StreamPanelPlayerType
  position?: PanelPosition
  side?: "bottom" | "left" | "right" | "top"
  variant?: "anchored" | "children" | "floating"
}
