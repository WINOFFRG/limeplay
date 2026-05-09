"use client"

import { useCallback, useEffect, useRef } from "react"

import { useDocsDialStore } from "@/lib/docs-dial-store"
import { getPresetById, type StreamPreset } from "@/lib/stream-presets"
import { useVolumeStore } from "@/registry/default/hooks/use-volume"
import { useMediaStore } from "@/registry/default/internal/media"

export function useStreamPanelSync() {
  const player = useMediaStore((state) => state.player.instance)
  const mediaElement = useMediaStore((state) => state.media.mediaElement)

  const volume = useDocsDialStore((s) => s.volume)
  const muted = useDocsDialStore((s) => s.muted)
  const autoplay = useDocsDialStore((s) => s.autoplay)
  const presetId = useDocsDialStore((s) => s.presetId)

  const setVolume = useVolumeStore((s) => s.setVolume)
  const setMuted = useVolumeStore((s) => s.setMuted)

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

  const loadStream = useCallback(
    (src: string, config?: string) => {
      if (!player || !mediaElement) return

      if (mediaElement instanceof HTMLVideoElement) {
        mediaElement.poster = ""
      }

      if (config) {
        try {
          const parsed = JSON.parse(config)
          player.configure(parsed)
        } catch {
          // invalid config — skip
        }
      }

      void player.load(src)
    },
    [player, mediaElement]
  )

  useEffect(() => {
    if (!player || !mediaElement) return
    if (presetId === prevPresetId.current && initialLoadDone.current) return

    initialLoadDone.current = true
    prevPresetId.current = presetId

    const preset = getPresetById(presetId)
    if (preset) {
      loadStream(preset.src)
    }
  }, [presetId, player, mediaElement, loadStream])

  const handlePresetChange = useCallback(
    (preset: StreamPreset) => {
      loadStream(preset.src)
    },
    [loadStream]
  )

  const handleLoadStream = useCallback(
    (src: string, config?: string) => {
      loadStream(src, config)
    },
    [loadStream]
  )

  return {
    handleLoadStream,
    handlePresetChange,
  }
}
