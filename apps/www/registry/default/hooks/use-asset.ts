"use client"

import type shaka from "shaka-player"

import { useEffect } from "react"

import type {
  PlaylistItem,
  PlaylistItemInput,
} from "@/registry/default/hooks/use-playlist"

import { usePlayback } from "@/registry/default/hooks/use-playback"
import { usePlayer } from "@/registry/default/hooks/use-player"
import { usePlaylist } from "@/registry/default/hooks/use-playlist"
import {
  useGetStore,
  useMediaStore,
} from "@/registry/default/ui/media-provider"

export interface Asset {
  config?: shaka.extern.PlayerConfiguration
  description?: string
  id: string
  poster?: string
  src: string
  title?: string
}

export interface UseAssetReturn {
  append: (items: PlaylistItemInput<Asset>[]) => void
  appendAssets: (assets: Asset[]) => void
  cancelPreload: (assetId: string) => void
  clear: () => void
  cycleRepeatMode: () => void
  getCurrentItem: () => null | PlaylistItem<Asset>
  getItem: (id: string) => null | PlaylistItem<Asset>
  getNextItem: () => null | PlaylistItem<Asset>
  getPrevItem: () => null | PlaylistItem<Asset>
  hasNext: () => boolean
  insert: (items: PlaylistItemInput<Asset>[], atIndex: number) => void
  isPreloaded: (assetId: string) => boolean
  load: (items: PlaylistItemInput<Asset>[], startIndex?: number) => void
  loadAsset: (asset: Asset) => Promise<boolean>
  loadPlaylist: (assets: Asset[], startIndex?: number) => void
  newSession: () => string
  next: () => Promise<boolean>
  playNext: (items: PlaylistItemInput<Asset>[]) => void
  preloadAsset: (asset: Asset) => Promise<void>
  preloadNext: () => Promise<void>
  prepend: (items: PlaylistItemInput<Asset>[]) => void
  previous: () => Promise<boolean>
  remove: (id: string) => void
  removeAt: (index: number) => void
  reorder: (fromIndex: number, toIndex: number) => void
  setRepeatMode: (mode: "all" | "off" | "one") => void
  setShuffle: (enabled: boolean) => void
  skipTo: (index: number) => Promise<void>
  skipToId: (id: string) => Promise<void>
  toggleShuffle: () => void
}

export function useAsset(): UseAssetReturn {
  const player = useMediaStore((state) => state.player)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const store = useGetStore()

  const { play } = usePlayback()

  const playback = usePlayer<Asset>({
    onError: (error: Error, asset?: Asset) => {
      console.error("[useAsset] Playback error:", error, asset?.id)
      throw error
    },
    onLoad: async (
      asset: Asset,
      shakaPlayer: shaka.Player,
      _media: HTMLMediaElement,
      preloadManager?: shaka.media.PreloadManager
    ) => {
      if (asset.config) {
        shakaPlayer.resetConfiguration()
        shakaPlayer.configure(asset.config)
      }

      if (preloadManager) {
        await shakaPlayer.load(preloadManager)
      } else {
        await shakaPlayer.load(asset.src)
      }

      if (player && mediaRef.current) {
        await play()
      }
    },
    onPreload: async (
      asset: Asset,
      shakaPlayer: shaka.Player
    ): Promise<null | shaka.media.PreloadManager> => {
      return shakaPlayer.preload(asset.src, undefined, undefined, asset.config)
    },
  })

  const playlist = usePlaylist<Asset>({
    onError: (item: PlaylistItem<Asset>, error: Error) => {
      console.error("[useAsset] Playlist error:", item.id, error)

      playlist.next()
    },
    onLoadItem: async (item: PlaylistItem<Asset>) => {
      const asset = item.properties

      await playback.load(asset)
    },
  })

  const onItemEnded = () => {
    if (playlist.hasNext()) {
      playlist.next()
    }
  }

  useEffect(() => {
    store.setState({
      onEnded: onItemEnded,
    })
  }, [onItemEnded])

  /**
   * Load a playlist of assets
   */
  const loadPlaylist = (assets: Asset[], startIndex = 0) => {
    const items = assets.map((asset) => ({
      id: asset.id,
      properties: asset,
    }))

    playlist.load(items, startIndex)
  }

  /**
   * Append assets to the queue
   */
  const appendAssets = (assets: Asset[]) => {
    const items = assets.map((asset) => ({
      id: asset.id,
      properties: asset,
    }))
    playlist.append(items)
  }

  /**
   * Load a single asset directly (bypasses playlist)
   */
  const loadAsset = async (asset: Asset) => {
    return playback.load(asset)
  }

  /**
   * Preload the next asset in the queue
   */
  const preloadNext = async () => {
    const nextItem = playlist.getNextItem()
    if (nextItem) {
      await playback.preload(nextItem.properties)
    }
  }

  const preloadAsset = async (asset: Asset) => {
    return playback.preload(asset)
  }

  return {
    ...playlist,
    appendAssets,
    cancelPreload: playback.cancelPreload,
    isPreloaded: playback.isPreloaded,
    loadAsset,
    loadPlaylist,
    preloadAsset,
    preloadNext,
  }
}
