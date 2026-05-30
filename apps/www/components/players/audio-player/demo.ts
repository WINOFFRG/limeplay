import type {
  AudioPlayerAsset,
  PlaybackUrls,
} from "@/registry/default/blocks/audio-player/components/media-player"

export const AUDIO_PLAYER_DEMO_PLAYLIST_ID = "324531068"

const API_BASE_URL = "https://limeplay.winoff.workers.dev/api/playlist"

export interface AudioPlayerPlaylistApiResponse {
  cached_at: string
  expires_at: string
  items: AudioPlayerPlaylistAssetItem[]
}

export interface AudioPlayerPlaylistAssetItem {
  artwork_url: string
  description?: string
  duration: number
  full_duration: number
  genre?: string
  has_downloads_left: boolean
  label_name?: null | string
  playback: PlaybackUrls
  tag_list?: string
  title: string
  urn: string
  waveform_url?: string
}

export async function fetchAudioPlayerDemoPlaylist(
  playlistId: string,
  signal: AbortSignal
): Promise<AudioPlayerAsset[]> {
  const response = await fetch(`${API_BASE_URL}/${playlistId}`, { signal })

  if (!response.ok) {
    throw new Error(`Failed to fetch playlist: ${response.statusText}`)
  }

  const data: AudioPlayerPlaylistApiResponse = await response.json()
  return data.items.map(toAudioPlayerAsset)
}

function toAudioPlayerAsset(
  item: AudioPlayerPlaylistAssetItem
): AudioPlayerAsset {
  return {
    description: item.description,
    duration: item.duration,
    genre: item.genre,
    id: item.urn,
    playbackUrls: item.playback,
    poster: item.artwork_url,
    title: item.title,
  }
}
