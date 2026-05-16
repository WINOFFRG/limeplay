"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"

import type { StreamPreset } from "@/lib/stream-presets"
import type { Asset, UseAssetOptions } from "@/registry/default/hooks/use-asset"

import { useDocsDialStore } from "@/lib/docs-dial-store"
import { getPresetById } from "@/lib/stream-presets"
import { useAsset } from "@/registry/default/hooks/use-asset"
import { useVolumeStore } from "@/registry/default/hooks/use-volume"
import { useMediaApi, useMediaStore } from "@/registry/default/internal/media"

export function useStreamPanelSync() {
  const store = useMediaApi()
  const mediaElement = useMediaStore((state) => state.media.mediaElement)
  const player = useMediaStore((state) => state.player.instance)

  const volume = useDocsDialStore((s) => s.volume)
  const muted = useDocsDialStore((s) => s.muted)
  const autoplay = useDocsDialStore((s) => s.autoplay)
  const presetId = useDocsDialStore((s) => s.presetId)

  const setVolume = useVolumeStore((s) => s.setVolume)
  const setMuted = useVolumeStore((s) => s.setMuted)

  const assetOptions = useMemo<UseAssetOptions<Asset>>(
    () => ({
      onLoadError: (_asset, error) => {
        store.setState(({ playback }) => {
          playback.status = "error"
          playback.error = error
        })
        return "stop"
      },
    }),
    [store]
  )

  const { loadPlaylist } = useAsset(assetOptions)

  const prevPresetId = useRef(presetId)
  const initialLoadDone = useRef(false)

  useEffect(() => {
    if (!mediaElement) return
    setVolume(volume / 100)
  }, [volume, mediaElement, setVolume])

  useEffect(() => {
    if (!mediaElement) return
    setMuted(muted)
  }, [muted, mediaElement, setMuted])

  useEffect(() => {
    if (!mediaElement) return
    mediaElement.autoplay = autoplay
  }, [autoplay, mediaElement])

  useEffect(() => {
    if (!player || !mediaElement) return
    if (presetId === prevPresetId.current && initialLoadDone.current) return

    initialLoadDone.current = true
    prevPresetId.current = presetId

    const preset = getPresetById(presetId)
    if (preset) {
      loadPlaylist([preset as unknown as Asset])
    }
  }, [presetId, player, mediaElement, loadPlaylist])

  const handlePresetChange = useCallback(
    (preset: StreamPreset) => {
      loadPlaylist([preset as unknown as Asset])
    },
    [loadPlaylist]
  )

  const handleLoadStream = useCallback(
    (src: string, config?: string) => {
      let parsedConfig: Record<string, unknown> | undefined
      if (config) {
        const parseResult = safeParseJson(config)
        if (!parseResult.ok) {
          store.setState(({ playback }) => {
            playback.status = "error"
            playback.error = new Error(
              "Invalid JSON config: " + parseResult.error
            )
          })
          return
        }
        parsedConfig = parseResult.value
      }
      const asset: StreamPreset = {
        config: parsedConfig,
        features: [],
        format: "progressive",
        group: "Special",
        id: `custom-${Date.now()}`,
        name: "Custom Stream",
        src,
        type: "video",
      }
      loadPlaylist([asset as unknown as Asset])
    },
    [loadPlaylist, store]
  )

  return {
    handleLoadStream,
    handlePresetChange,
  }
}

function safeParseJson(
  str: string
): { error: string; ok: false } | { ok: true; value: Record<string, unknown> } {
  try {
    return { ok: true, value: JSON.parse(str) }
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e), ok: false }
  }
}
