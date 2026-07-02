import type shaka from "shaka-player"

export interface CatalogBaseAsset {
  config?: shaka.extern.PlayerConfiguration
  description?: string
  id?: string
  poster?: string
  src?: string
  title?: string
}

export type CatalogPlayerType = "audio" | "video"

export interface CatalogPlaylistPreset {
  count?: number
  description: string
  id: string
  name: string
  type: CatalogPlayerType
}
