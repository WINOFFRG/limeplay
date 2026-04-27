"use client"

import type shaka from "shaka-player"

import clamp from "lodash.clamp"
import React from "react"

import type {
  MediaEventSlice,
  MediaFeature,
  MediaStore,
} from "@/registry/default/ui/media-provider"

import { useInterval } from "@/registry/default/hooks/use-interval"
import { useMediaStore } from "@/registry/default/hooks/use-media"
import {
  MediaReadyState,
  usePlaybackStore,
} from "@/registry/default/hooks/use-playback"
import {
  type PlayerStore,
  usePlayerStore,
} from "@/registry/default/hooks/use-player"
import { noop, off, on, toFixedNumber } from "@/registry/default/lib/utils"
import {
  useMediaEvents,
  useMediaFeatureApi,
  useMediaFeatureStore,
} from "@/registry/default/ui/media-provider"

export const TIMELINE_FEATURE_KEY = "timeline"

export interface TimelineEvents {
  durationchange: { duration: number }
  seek: { from: number; to: number }
  timeupdate: { currentTime: number; duration: number; progress: number }
}

export interface TimelineStore extends MediaEventSlice<TimelineEvents> {
  "timeline": {
    buffered: shaka.extern.BufferedRange[]
    currentTime: number
    duration: number
    hoveringTime: number
    isHovering: boolean
    isLive: boolean
    liveLatency: null | number
    processBufferedRanges: (
      bufferedRanges: shaka.extern.BufferedRange[],
      variant?: "combined" | "default" | "from-zero"
    ) => Array<{ startPercent: number; widthPercent: number }>
    progress: number
    seek: (time: number) => void
    setHoveringTime: (time: number) => void
    setIsHovering: (isHovering: boolean) => void
  }
}

export function timelineFeature(): MediaFeature<
  TimelineStore,
  MediaStore & PlayerStore & TimelineStore
> {
  return {
    createSlice: (set, get, _store, events) => ({
      [TIMELINE_FEATURE_KEY]: {
        buffered: [],
        currentTime: 0,
        duration: 0,
        hoveringTime: 0,
        isHovering: false,
        isLive: false,
        liveLatency: null,
        processBufferedRanges: (bufferedRanges, variant = "default") => {
          const timeline = get().timeline
          const player = get().player.instance
          const duration = timeline.duration

          if (!bufferedRanges.length || !duration) {
            return []
          }

          let normalizedBuffered: shaka.extern.BufferedRange[] = []

          if (variant === "combined") {
            const combinedBuffered = bufferedRanges.reduce(
              (acc, range) => {
                acc.start = Math.min(acc.start, range.start)
                acc.end = Math.max(acc.end, range.end)
                return acc
              },
              { end: 0, start: Infinity }
            )

            if (combinedBuffered.start !== Infinity) {
              normalizedBuffered = [
                {
                  end: combinedBuffered.end,
                  start: combinedBuffered.start,
                },
              ]
            }
          } else if (variant === "from-zero") {
            normalizedBuffered = bufferedRanges.map((range) => ({
              end: range.end,
              start: 0,
            }))
          } else {
            normalizedBuffered = bufferedRanges
          }

          return normalizedBuffered.map((range) => {
            let startPercent: number
            let widthPercent: number

            if (timeline.isLive && player) {
              const seekRange = player.seekRange()
              const relativeStart = Math.max(0, range.start - seekRange.start)
              const relativeEnd = Math.max(0, range.end - seekRange.start)

              startPercent = (relativeStart / duration) * 100
              widthPercent = ((relativeEnd - relativeStart) / duration) * 100
            } else {
              startPercent = (range.start / duration) * 100
              widthPercent = ((range.end - range.start) / duration) * 100
            }

            return { startPercent, widthPercent }
          })
        },
        progress: 0,
        seek: (time) => {
          const media = get().media.mediaElement
          const timeline = get().timeline
          const player = get().player.instance
          if (!media || !Number.isFinite(timeline.duration)) return

          const fromTime = media.currentTime

          let actualSeekTime = time
          let storeCurrentTime = time

          if (timeline.isLive && player) {
            const seekRange = player.seekRange()
            actualSeekTime = clamp(time, seekRange.start, seekRange.end)
            storeCurrentTime = actualSeekTime - seekRange.start
          } else {
            actualSeekTime = clamp(time, 0, timeline.duration)
            storeCurrentTime = actualSeekTime
          }

          set(({ timeline }) => {
            timeline.currentTime = storeCurrentTime
            timeline.progress = storeCurrentTime / timeline.duration
          })

          media.currentTime = actualSeekTime
          events.emit("seek", {
            from: fromTime,
            to: actualSeekTime,
          })
        },
        setHoveringTime: (time) => {
          const timeline = get().timeline
          if (!Number.isFinite(timeline.duration)) return

          set(({ timeline }) => {
            timeline.hoveringTime = time
          })
        },
        setIsHovering: (isHovering) => {
          set(({ timeline }) => {
            timeline.isHovering = isHovering
          })
        },
      },
    }),
    key: TIMELINE_FEATURE_KEY,
    Setup: TimelineSetup,
  }
}

export function useTimelineStore<TSelected>(
  selector: (state: TimelineStore["timeline"]) => TSelected
): TSelected {
  return useMediaFeatureStore<TimelineStore, TSelected>(
    TIMELINE_FEATURE_KEY,
    (state) => selector(state.timeline)
  )
}

function TimelineSetup() {
  const UPDATE_DURATION = 500

  const store = useMediaFeatureApi<TimelineStore>(TIMELINE_FEATURE_KEY)
  const events = useMediaEvents<TimelineEvents>()
  const player = usePlayerStore((state) => state.instance)
  const mediaElement = useMediaStore((state) => state.mediaElement)
  const canPlay = usePlaybackStore((state) => state.canPlay)
  const readyState = usePlaybackStore((state) => state.readyState)
  const status = usePlaybackStore((state) => state.status)

  const isLive = player?.isLive() ?? false

  const onTimeUpdate = React.useCallback(() => {
    if (!mediaElement || !player) return

    if (readyState < MediaReadyState.HAVE_METADATA) return

    let currentTime = mediaElement.currentTime
    let liveLatency = isLive ? 0 : null
    let progress = 0

    const timeline = store.getState().timeline

    if (isLive) {
      const seekRange = player.seekRange()
      liveLatency =
        mediaElement.currentTime === 0
          ? 0
        : seekRange.end - mediaElement.currentTime

      liveLatency = toFixedNumber(clamp(liveLatency, 0, seekRange.end), 4)

      progress =
        1 -
      (seekRange.end - mediaElement.currentTime) /
          (seekRange.end - seekRange.start)

      progress = toFixedNumber(clamp(progress, 0, 1), 4)
    } else {
      currentTime = clamp(mediaElement.currentTime, 0, timeline.duration)
      progress = toFixedNumber(currentTime / timeline.duration, 4)
    }

    store.setState(({ timeline }) => {
      timeline.currentTime = currentTime
      timeline.isLive = isLive
      timeline.liveLatency = liveLatency
      timeline.progress = progress

      if (isLive) {
        timeline.duration =
          player.seekRange().end - player.seekRange().start
      }
    })

    events.emit("timeupdate", {
      currentTime,
      duration: store.getState().timeline.duration,
      progress,
    })
  }, [events, isLive, mediaElement, player, readyState, store])

  const onDurationChange = React.useCallback(() => {
    if (!mediaElement || !player) return

    const seekRange = player.seekRange()
    const playerDuration = player.isLive()
      ? seekRange.end - seekRange.start
      : mediaElement.duration

    if (playerDuration && Number.isFinite(playerDuration)) {
      store.setState(({ timeline }) => {
        timeline.duration = playerDuration
      })

      events.emit("durationchange", { duration: playerDuration })
    }
  }, [events, mediaElement, player, store])

  const onBuffer = React.useCallback(() => {
    if (!player) return

    const bufferedInfo = player.getBufferedInfo()

    if (player.isBuffering()) {
      return
    }

    store.setState(({ timeline }) => {
      timeline.buffered = bufferedInfo.total
    })
  }, [player, store])

  const onLoading = React.useCallback(() => {
    store.setState(({ timeline }) => {
      timeline.buffered = []
      timeline.currentTime = 0
      timeline.duration = 0
      timeline.isLive = false
      timeline.liveLatency = null
      timeline.progress = 0
    })
  }, [store])

  const isActive = status === "playing" || status === "buffering"
  useInterval(onTimeUpdate, isActive ? UPDATE_DURATION : null)

  React.useEffect(() => {
    if (!mediaElement || !player) return noop

    const media = mediaElement

    if (canPlay) {
      onTimeUpdate()
      onDurationChange()
      onBuffer()
    }

    on(media, ["durationchange", "loading"], onDurationChange)
    on(media, "progress", onBuffer)
    on(player, ["trackschanged", "loading"], onBuffer)
    on(player, "loading", onLoading)

    return () => {
      off(media, ["durationchange", "loading"], onDurationChange)
      off(media, "progress", onBuffer)
      off(player, ["trackschanged", "loading"], onBuffer)
      off(player, "loading", onLoading)
    }
  }, [
    canPlay,
    mediaElement,
    onBuffer,
    onDurationChange,
    onLoading,
    onTimeUpdate,
    player,
  ])

  return null
}
