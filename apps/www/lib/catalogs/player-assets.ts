import type shaka from "shaka-player"

import type { AppleMusicChartAsset } from "@/lib/catalogs/apple-music"
import type {
  BlenderOpenFilmAsset,
  BlenderOpenFilmImages,
} from "@/lib/catalogs/blender-open-films"
import type { CatalogAsset } from "@/lib/catalogs/playlists"
import type { StreamPreset } from "@/lib/stream-presets"

export type CatalogPlayerAsset =
  | CatalogPlayerAudioAsset
  | CatalogPlayerVideoAsset

export interface CatalogPlayerAudioAsset {
  albumName?: string
  artistName?: string
  config?: shaka.extern.PlayerConfiguration
  description?: string
  duration?: number
  features?: string[]
  genre?: string
  group?: string
  id?: string
  poster?: string
  source?: "apple-music-chart" | "custom-stream" | "stream-preset"
  src?: string
  title?: string
  url?: string
}

export interface CatalogPlayerVideoAsset {
  config?: shaka.extern.PlayerConfiguration
  description?: string
  duration?: number
  features?: string[]
  group?: string
  id?: string
  images?: BlenderOpenFilmImages
  poster?: string
  source?: "blender-open-film" | "custom-stream" | "stream-preset"
  src?: string
  subtitle?: string
  title?: string
  year?: string
}

export function mapCatalogAssetsToPlayerAssets(
  assets: readonly CatalogAsset[]
): CatalogPlayerAsset[] {
  return assets.map(mapCatalogAssetToPlayerAsset)
}

export function mapCatalogAssetToPlayerAsset(
  asset: CatalogAsset
): CatalogPlayerAsset {
  if (asset.source === "apple-music-chart") {
    return mapAppleMusicChartAsset(asset)
  }

  return mapBlenderOpenFilmAsset(asset)
}

export function mapStreamPresetToPlayerAsset(
  preset: StreamPreset,
  source: "custom-stream" | "stream-preset" = "stream-preset"
): CatalogPlayerAsset {
  return {
    config: toPlayerConfig(preset.config),
    description: preset.description,
    features: preset.features,
    group: preset.group,
    id: preset.id,
    poster: preset.poster ?? preset.thumbnail,
    source,
    src: preset.src,
    title: preset.title,
  }
}

function mapAppleMusicChartAsset(
  asset: AppleMusicChartAsset
): CatalogPlayerAudioAsset {
  return {
    albumName: asset.albumName,
    artistName: asset.artistName,
    config: asset.config,
    description: asset.description,
    duration: asset.duration,
    genre: asset.genre,
    id: asset.id,
    poster: asset.poster,
    source: asset.source,
    src: asset.src,
    title: asset.title,
    url: asset.url,
  }
}

function mapBlenderOpenFilmAsset(
  asset: BlenderOpenFilmAsset
): CatalogPlayerVideoAsset {
  return {
    config: asset.config,
    description: asset.description,
    duration: asset.duration,
    id: asset.id,
    images: asset.images,
    poster: asset.poster ?? asset.images?.thumbnail ?? asset.images?.poster,
    source: asset.source,
    subtitle: asset.subtitle,
    title: asset.title,
    year: asset.year ? String(asset.year) : undefined,
  }
}

function toPlayerConfig(
  config: StreamPreset["config"]
): shaka.extern.PlayerConfiguration | undefined {
  return config as shaka.extern.PlayerConfiguration | undefined
}
