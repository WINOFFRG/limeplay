import type shaka from "shaka-player"

import type { StreamPanelPlayerType } from "@/components/stream-panel/use-stream-panel"
import type { Asset } from "@/registry/default/hooks/use-asset"

export interface BlenderOpenFilmAsset extends Asset {
  duration?: number
  images?: BlenderOpenFilmImages
  source: "blender-open-film"
  subtitle?: string
  year?: number
}
export interface BlenderOpenFilmImages {
  backdrop?: string
  logo?: string
  poster?: string
}

export interface BlenderStreamResponse extends BlenderPlaylistItem {
  captions?: BlenderStreamCaption[]
  links?: Record<string, string | undefined>
  playback: {
    hls: string
    mimeType?: string
  }
}

export interface StreamPanelPlaylistPreset {
  count?: number
  description: string
  id: string
  name: string
  type: StreamPanelPlayerType
}

interface BlenderPlaylistItem {
  description?: string
  duration?: number
  id: string
  images?: BlenderOpenFilmImages
  subtitle?: string
  title: string
  year?: number
}

interface BlenderPlaylistResponse {
  count: number
  items: BlenderPlaylistItem[]
  title: string
}

interface BlenderStreamCaption {
  kind?: TextTrackKind
  label: string
  language: string
  mimeType?: string
  url: string
}

const BLENDER_OPEN_FILMS_PLAYLIST_ID = "blender-open-films"

const BLENDER_API_BASE_URL = "https://limeplay.winoffrg.workers.dev/api/blender"

const STREAM_PANEL_PLAYLIST_PRESETS: StreamPanelPlaylistPreset[] = [
  {
    count: 17,
    description: "Open movies from Blender Studio",
    id: BLENDER_OPEN_FILMS_PLAYLIST_ID,
    name: "Blender Open Films",
    type: "video",
  },
]

export async function addBlenderCaptions(
  player: shaka.Player,
  stream: BlenderStreamResponse
): Promise<void> {
  if (!stream.captions || stream.captions.length === 0) return

  await Promise.all(
    stream.captions.map((caption) =>
      player.addTextTrackAsync(
        caption.url,
        caption.language,
        caption.kind ?? "subtitles",
        caption.mimeType ?? "text/vtt",
        undefined,
        caption.label
      )
    )
  )
}

export async function fetchBlenderStream(
  assetId: string,
  signal?: AbortSignal
): Promise<BlenderStreamResponse> {
  const response = await fetch(`${BLENDER_API_BASE_URL}/stream/${assetId}`, {
    signal,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Blender stream: ${response.statusText}`)
  }

  return (await response.json()) as BlenderStreamResponse
}

export async function fetchPlaylistPresetAssets(
  playlistId: string,
  signal?: AbortSignal
): Promise<Asset[]> {
  if (playlistId !== BLENDER_OPEN_FILMS_PLAYLIST_ID) {
    throw new Error(`Unknown playlist preset "${playlistId}".`)
  }

  const response = await fetch(`${BLENDER_API_BASE_URL}/playlist`, { signal })
  if (!response.ok) {
    throw new Error(`Failed to fetch Blender playlist: ${response.statusText}`)
  }

  const playlist = (await response.json()) as BlenderPlaylistResponse

  return playlist.items.map(toBlenderOpenFilmAsset)
}

export function getPlaylistPresetsForType(
  playerType: StreamPanelPlayerType
): StreamPanelPlaylistPreset[] {
  return STREAM_PANEL_PLAYLIST_PRESETS.filter(
    (playlist) => playlist.type === playerType
  )
}

export function isBlenderOpenFilmAsset(
  asset: Asset
): asset is BlenderOpenFilmAsset {
  return "source" in asset && asset.source === "blender-open-film"
}

function toBlenderOpenFilmAsset(
  item: BlenderPlaylistItem
): BlenderOpenFilmAsset {
  return {
    description: item.description,
    duration: item.duration,
    id: item.id,
    images: item.images,
    poster: item.images?.backdrop ?? item.images?.poster,
    source: "blender-open-film",
    subtitle: item.subtitle,
    title: item.title,
    year: item.year,
  }
}
