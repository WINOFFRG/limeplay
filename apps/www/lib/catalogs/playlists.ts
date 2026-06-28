import type { AppleMusicChartAsset } from "@/lib/catalogs/apple-music"
import type { BlenderOpenFilmAsset } from "@/lib/catalogs/blender-open-films"
import type {
  CatalogPlayerType,
  CatalogPlaylistPreset,
} from "@/lib/catalogs/types"

import {
  APPLE_MUSIC_CHARTS_PLAYLIST_ID,
  fetchAppleMusicChartAssetsPage,
} from "@/lib/catalogs/apple-music"
import {
  BLENDER_OPEN_FILMS_PLAYLIST_ID,
  fetchBlenderOpenFilmAssets,
} from "@/lib/catalogs/blender-open-films"

export type CatalogAsset = AppleMusicChartAsset | BlenderOpenFilmAsset

export const CATALOG_PLAYLIST_PRESETS: CatalogPlaylistPreset[] = [
  {
    count: 17,
    description: "Open movies from Blender Studio",
    id: BLENDER_OPEN_FILMS_PLAYLIST_ID,
    name: "Blender Open Films",
    type: "video",
  },
  {
    description: "Top songs from Apple Music for your region",
    id: APPLE_MUSIC_CHARTS_PLAYLIST_ID,
    name: "Apple Music Charts",
    type: "audio",
  },
]

export async function fetchPlaylistPresetAssets(
  playlistId: string,
  signal?: AbortSignal
): Promise<CatalogAsset[]> {
  if (playlistId === APPLE_MUSIC_CHARTS_PLAYLIST_ID) {
    return (await fetchAppleMusicChartAssetsPage(1, signal)).assets
  }

  if (playlistId === BLENDER_OPEN_FILMS_PLAYLIST_ID) {
    return fetchBlenderOpenFilmAssets(signal)
  }

  throw new Error(`Unknown playlist preset "${playlistId}".`)
}

export function getPlaylistPresetsForType(
  playerType: CatalogPlayerType
): CatalogPlaylistPreset[] {
  return CATALOG_PLAYLIST_PRESETS.filter(
    (playlist) => playlist.type === playerType
  )
}
