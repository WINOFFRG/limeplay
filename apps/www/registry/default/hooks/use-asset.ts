"use client"

import type shaka from "shaka-player"

import { useEffect, useRef } from "react"

import type { UsePlayerOptions } from "@/registry/default/hooks/use-player"
import type {
  PlaylistItem,
  PlaylistItemInput,
} from "@/registry/default/hooks/use-playlist"
import type { UsePlaylistOptions } from "@/registry/default/hooks/use-playlist"

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

export interface UseAssetOptions<TAsset extends Asset> {
  autoplayFirst?: boolean
  playerOptions?: Partial<UsePlayerOptions<TAsset>>
  playlistOptions?: Partial<UsePlaylistOptions<TAsset>>
}

export interface UseAssetReturn<TAsset extends Asset> {
  append: (items: PlaylistItemInput<TAsset>[]) => void
  appendAssets: (assets: TAsset[]) => void
  cancelPreload: (assetId: string) => void
  clear: () => void
  currentItem: null | PlaylistItem<TAsset>
  cycleRepeatMode: () => void
  getItem: (id: string) => null | PlaylistItem<TAsset>
  hasNext: boolean
  hasPrevious: boolean
  insert: (items: PlaylistItemInput<TAsset>[], atIndex: number) => void
  isPreloaded: (assetId: string) => boolean
  load: (items: PlaylistItemInput<TAsset>[], startIndex?: number) => void
  loadAsset: (asset: TAsset) => Promise<boolean>
  loadPlaylist: (assets: TAsset[], startIndex?: number) => void
  newSession: () => string
  next: () => Promise<boolean>
  nextItem: null | PlaylistItem<TAsset>
  playNext: (items: PlaylistItemInput<TAsset>[]) => void
  preloadAsset: (asset: TAsset) => Promise<void>
  preloadNext: () => Promise<void>
  prepend: (items: PlaylistItemInput<TAsset>[]) => void
  previous: () => Promise<boolean>
  previousItem: null | PlaylistItem<TAsset>
  remove: (id: string) => void
  removeAt: (index: number) => void
  reorder: (fromIndex: number, toIndex: number) => void
  setRepeatMode: (mode: "all" | "off" | "one") => void
  setShuffle: (enabled: boolean) => void
  skipTo: (index: number) => Promise<void>
  skipToId: (id: string) => Promise<void>
  toggleShuffle: () => void
}

export function useAsset<TAsset extends Asset = Asset>(
  options?: UseAssetOptions<TAsset>
): UseAssetReturn<TAsset> {
  const player = useMediaStore((state) => state.player)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const store = useGetStore()

  const { play } = usePlayback()
  const isFirstLoadRef = useRef(true)

  const playback = usePlayer<TAsset>({
    onError: (error: Error, asset?: TAsset) => {
      console.error("[useAsset] Playback error:", error, asset?.id)
      throw error
    },
    onLoad: async (
      asset: TAsset,
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

      if (player && mediaRef.current && mediaRef.current.autoplay) {
        if (isFirstLoadRef.current) {
          if (options?.autoplayFirst) {
            await play()
          }
        } else {
          await play()
        }
      }

      isFirstLoadRef.current = false
    },
    onPreload: async (
      asset: TAsset,
      shakaPlayer: shaka.Player
    ): Promise<null | shaka.media.PreloadManager> => {
      return shakaPlayer.preload(asset.src, undefined, undefined, asset.config)
    },
    ...options?.playerOptions,
  })

  const playlist = usePlaylist<TAsset>({
    onError: (item: PlaylistItem<TAsset>, error: Error) => {
      console.error("[useAsset] Playlist error:", item.id, error)

      const state = store.getState()
      if (
        state.repeatMode === "all" ||
        (state.currentIndex >= 0 && state.currentIndex < state.queue.length - 1)
      ) {
        // Safe to call next without depending on the returned object from usePlaylist directly
        // because we return the full playlist object below. Wait, we can't call playlist.next() yet
        // since `playlist` isn't fully constructed. But this is a callback, so it will be constructed.
        playlist.next()
      }
    },
    onLoadItem: async (item: PlaylistItem<TAsset>) => {
      const asset = item.properties

      await playback.load(asset)
    },
    ...options?.playlistOptions,
  })

  const onItemEnded = () => {
    if (playlist.hasNext) {
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
  const loadPlaylist = (assets: TAsset[], startIndex = 0) => {
    isFirstLoadRef.current = true
    const items = assets.map((asset) => ({
      id: asset.id,
      properties: asset,
    }))

    playlist.load(items, startIndex)
  }

  /**
   * Append assets to the queue
   */
  const appendAssets = (assets: TAsset[]) => {
    const items = assets.map((asset) => ({
      id: asset.id,
      properties: asset,
    }))
    playlist.append(items)
  }

  /**
   * Load a single asset directly (bypasses playlist)
   */
  const loadAsset = async (asset: TAsset) => {
    isFirstLoadRef.current = true
    return playback.load(asset)
  }

  /**
   * Preload the next asset in the queue
   */
  const preloadNext = async () => {
    const nextItem = playlist.nextItem
    if (nextItem) {
      await playback.preload(nextItem.properties)
    }
  }

  const preloadAsset = async (asset: TAsset) => {
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
