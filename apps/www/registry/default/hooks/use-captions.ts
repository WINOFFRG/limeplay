"use client"

import type shaka from "shaka-player"
import type { StateCreator } from "zustand"

import { useCallback, useEffect } from "react"

import type { PlaybackStore } from "@/registry/default/hooks/use-playback"

import { getDeviceLanguage, off, on } from "@/registry/default/lib/utils"
import {
  useGetStore,
  useMediaStore,
} from "@/registry/default/ui/media-provider"

export interface CaptionsStore {
  activeTextTrack: null | shaka.extern.TextTrack
  onCaptionsChange?: (payload: {
    track?: shaka.extern.TextTrack
    visible: boolean
  }) => void
  onTextTrackChange?: (payload: { track?: shaka.extern.TextTrack }) => void
  setTextTrackContainerElement: (ref: HTMLDivElement | null) => void

  textTrackContainerElement: HTMLDivElement | null
  textTracks?: shaka.extern.TextTrack[]

  textTrackVisible: boolean
}

export const createCaptionsStore: StateCreator<
  CaptionsStore & PlaybackStore,
  [],
  [],
  CaptionsStore
> = (set) => ({
  activeTextTrack: null,
  onCaptionsChange: undefined,
  onTextTrackChange: undefined,
  setTextTrackContainerElement: (element: HTMLDivElement | null) => {
    set({
      textTrackContainerElement: element,
    })
  },

  textTrackContainerElement: null,
  textTracks: undefined,

  textTrackVisible: false,
})

export interface UseCaptionsReturn {
  toggleCaptionVisibility: () => void
}

export function useCaptions(): UseCaptionsReturn {
  const store = useGetStore()
  const player = useMediaStore((s) => s.player)
  const activeTextTrack = useMediaStore((s) => s.activeTextTrack)
  const textTracks = useMediaStore((s) => s.textTracks)

  const findDefaultTrack = useCallback(() => {
    if (!textTracks) {
      console.warn("No text tracks found")
      return
    }

    if (textTracks.length === 1) {
      return textTracks[0]
    }

    const deviceLanguage = getDeviceLanguage()

    const regionalTrack = textTracks.find(
      (track) => track.language === deviceLanguage
    )

    if (regionalTrack) {
      return regionalTrack
    }

    return textTracks[0]
  }, [textTracks])

  const selectTrack = useCallback(
    (track: shaka.extern.TextTrack) => {
      if (!player || !textTracks) {
        return false
      }

      player.selectTextTrack(track)

      const activeTextTrack = player
        .getTextTracks()
        .find((t: shaka.extern.TextTrack) => t.active)

      store.setState({ activeTextTrack })

      return true
    },
    [player, textTracks]
  )

  const toggleCaptionVisibility = () => {
    if (!player) {
      return
    }

    if (!activeTextTrack) {
      const defaultTrack = findDefaultTrack()
      if (defaultTrack) {
        const isSuccess = selectTrack(defaultTrack)

        if (!isSuccess) {
          console.error("Failed to select default text track")
          return
        }
      }
    }

    const isVisible = store.getState().textTrackVisible
    player.setTextTrackVisibility(!isVisible)
  }

  return {
    toggleCaptionVisibility,
  }
}

export function useCaptionsStates() {
  const store = useGetStore()
  const player = useMediaStore((s) => s.player)
  const containerElement = useMediaStore((s) => s.textTrackContainerElement)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const canPlay = useMediaStore((state) => state.canPlay)

  const onTextTrackChanged = () => {
    if (!player) {
      return
    }

    const activeTextTrack = player
      .getTextTracks()
      .find((t: shaka.extern.TextTrack) => t.active)

    store.setState({ activeTextTrack })

    store.getState().onTextTrackChange?.({ track: activeTextTrack })
  }

  const onTracksChanged = () => {
    if (!player) {
      return
    }

    const tracks = player.getTextTracks()
    store.setState({ textTracks: tracks })
  }

  const onTextTrackVisibility = () => {
    if (!player) {
      return
    }

    const isVisible = player.isTextTrackVisible()
    const activeTrack = store.getState().activeTextTrack

    store.setState({ textTrackVisible: isVisible })

    store.getState().onCaptionsChange?.({
      track: activeTrack || undefined,
      visible: isVisible,
    })
  }

  useEffect(() => {
    if (!player || !containerElement) {
      return
    }

    player.setVideoContainer(containerElement)
  }, [containerElement, player])

  useEffect(() => {
    if (!mediaRef.current || !player) return

    if (canPlay) {
      onTracksChanged()
    }

    on(player, "textchanged", onTextTrackChanged)
    on(player, ["trackschanged", "loading"], onTracksChanged)
    on(player, "texttrackvisibility", onTextTrackVisibility)

    return () => {
      off(player, "textchanged", onTextTrackChanged)
      off(player, ["trackschanged", "loading"], onTracksChanged)
      off(player, "texttrackvisibility", onTextTrackVisibility)
    }
  }, [mediaRef, player, canPlay])
}
