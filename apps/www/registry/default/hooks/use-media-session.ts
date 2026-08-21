"use client"

import * as React from "react"

export type MediaSessionActionHandlers = Partial<
  Record<MediaSessionActionName, MediaSessionActionHandler | null>
>

export type MediaSessionActionName =
  | "enterpictureinpicture"
  | "hangup"
  | "nextslide"
  | "previousslide"
  | "togglecamera"
  | "togglemicrophone"
  | "togglescreenshare"
  | MediaSessionAction

export interface MediaSessionChapterInformationInit {
  artwork?: MediaImage[]
  startTime?: number
  title?: string
}

export type MediaSessionMetadata = MediaMetadataInit & {
  chapterInfo?: MediaSessionChapterInformationInit[]
}

export interface MediaSessionPictureInPictureActionDetails extends MediaSessionActionDetails {
  enterPictureInPictureReason?: "contentoccluded" | "other" | "useraction"
}

export interface MediaSessionPlaylistNavigation {
  getNextIndex: () => number
  getPreviousIndex: () => number
  queue: readonly unknown[]
  repeatMode: "all" | "off" | "one"
}

export type MediaSessionSourceType = "asset" | "playlist" | null

export interface UseMediaSessionActionHandlersOptions {
  canEnterPictureInPicture?: boolean
  canGoNext?: boolean
  canGoPrevious?: boolean
  getCurrentTime: () => number
  getSeekRange?: () => null | undefined | { start: number }
  onEnterPictureInPicture?: (
    details: MediaSessionPictureInPictureActionDetails
  ) => void
  onNextTrack?: () => void
  onPause: () => void
  onPlay: () => MaybePromise<void>
  onPreviousTrack?: () => void
  onSeek: (time: number, details: MediaSessionActionDetails) => void
  onSkipAd?: () => void
  onStop?: () => void
  seekOffset?: number
}

export interface UseMediaSessionReturn {
  clearMetadata: () => void
  clearPositionState: () => void
  setActionHandler: (
    action: MediaSessionActionName,
    handler: MediaSessionActionHandler | null
  ) => () => void
  setMetadata: (metadata: MediaSessionMetadata) => void
  setPlaybackState: (state: MediaSessionPlaybackState) => void
  setPositionState: (state: MediaPositionState) => void
  supported: boolean
}

export interface UseMediaSessionSyncOptions {
  actions?: MediaSessionActionHandlers
  active?: boolean
  metadata?: MediaSessionMetadata | null
  playbackState?: MediaSessionPlaybackState
  position?: MediaPositionState | null
}

type MaybePromise<T> = Promise<T> | T

const DEFAULT_MEDIA_SESSION_SEEK_OFFSET_SECONDS = 10

export function canMoveToNextMediaSessionTrack(
  sourceType: MediaSessionSourceType,
  playlist: MediaSessionPlaylistNavigation
): boolean {
  return (
    isMediaSessionPlaylistSource(sourceType) &&
    hasNextMediaSessionPlaylistItem(playlist)
  )
}

export function canMoveToPreviousMediaSessionTrack(
  sourceType: MediaSessionSourceType,
  playlist: MediaSessionPlaylistNavigation
): boolean {
  return (
    isMediaSessionPlaylistSource(sourceType) &&
    hasPreviousMediaSessionPlaylistItem(playlist)
  )
}

export function canStartMediaSessionPlayback(status: string): boolean {
  return !["error", "init"].includes(status)
}

export function getMediaSessionCurrentTime({
  currentTime,
  isLive,
  mediaElement,
}: {
  currentTime: number
  isLive: boolean
  mediaElement: HTMLMediaElement | null
}): number {
  return isLive && mediaElement ? mediaElement.currentTime : currentTime
}

export function getMediaSessionMetadataValue(
  ...values: (null | number | string | undefined)[]
): string | undefined {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value)
    }

    if (typeof value !== "string") continue

    const trimmed = value.trim()
    if (trimmed) return trimmed
  }

  return undefined
}

export function getMediaSessionPlaybackState({
  active,
  status,
}: {
  active: boolean
  status: string
}): MediaSessionPlaybackState {
  if (!active) return "none"

  return status === "playing" ? "playing" : "paused"
}

export function getMediaSessionPositionState({
  active,
  currentTime,
  duration,
  playbackRate = 1,
}: {
  active: boolean
  currentTime: number
  duration: number
  playbackRate?: number
}): MediaPositionState | null {
  if (!active) return null
  if (!isValidDuration(duration)) return null
  if (!Number.isFinite(currentTime) || currentTime < 0) return null
  if (!isValidPlaybackRate(playbackRate)) return null

  return {
    duration,
    playbackRate,
    position: getSafePosition(currentTime, duration),
  }
}

export function isMediaSessionPlaylistSource(
  sourceType: MediaSessionSourceType
): boolean {
  return sourceType === "playlist"
}

export function useMediaSession(): UseMediaSessionReturn {
  const supported = isMediaSessionSupported()

  const clearMetadata = React.useCallback(() => {
    const session = getMediaSession()
    if (!session) return

    session.metadata = null
  }, [])

  const clearPositionState = React.useCallback(() => {
    const session = getMediaSession()
    if (!session) return

    try {
      session.setPositionState()
    } catch (error) {
      console.warn("[useMediaSession] Failed to clear position state:", error)
    }
  }, [])

  const setActionHandler = React.useCallback(
    (
      action: MediaSessionActionName,
      handler: MediaSessionActionHandler | null
    ) => {
      const session = getMediaSession()
      if (!session) return noop

      setSafeActionHandler(session, action, handler)

      return () => {
        setSafeActionHandler(session, action, null)
      }
    },
    []
  )

  const setMetadata = React.useCallback((metadata: MediaSessionMetadata) => {
    const session = getMediaSession()
    if (
      !session ||
      typeof window === "undefined" ||
      typeof window.MediaMetadata !== "function"
    ) {
      return
    }

    try {
      session.metadata = new window.MediaMetadata(metadata)
    } catch (error) {
      console.warn("[useMediaSession] Failed to set metadata:", error)
    }
  }, [])

  const setPlaybackState = React.useCallback(
    (state: MediaSessionPlaybackState) => {
      const session = getMediaSession()
      if (!session) return

      try {
        session.playbackState = state
      } catch (error) {
        console.warn("[useMediaSession] Failed to set playback state:", error)
      }
    },
    []
  )

  const setPositionState = React.useCallback((state: MediaPositionState) => {
    const session = getMediaSession()
    if (!session) return

    const safeState = normalizePositionState(state)
    if (!safeState) return

    try {
      session.setPositionState(safeState)
    } catch (error) {
      console.warn("[useMediaSession] Failed to set position state:", error)
    }
  }, [])

  return React.useMemo(
    () => ({
      clearMetadata,
      clearPositionState,
      setActionHandler,
      setMetadata,
      setPlaybackState,
      setPositionState,
      supported,
    }),
    [
      clearMetadata,
      clearPositionState,
      setActionHandler,
      setMetadata,
      setPlaybackState,
      setPositionState,
      supported,
    ]
  )
}

export function useMediaSessionActionHandlers(
  options: UseMediaSessionActionHandlersOptions
): MediaSessionActionHandlers {
  const optionsRef = React.useRef(options)
  optionsRef.current = options

  const canEnterPictureInPicture = Boolean(
    options.canEnterPictureInPicture && options.onEnterPictureInPicture
  )
  const canGoNext = Boolean(options.canGoNext && options.onNextTrack)
  const canGoPrevious = Boolean(
    options.canGoPrevious && options.onPreviousTrack
  )
  const canSkipAd = Boolean(options.onSkipAd)
  const canStop = Boolean(options.onStop)

  return React.useMemo(
    () => ({
      enterpictureinpicture: canEnterPictureInPicture
        ? (details) => {
            optionsRef.current.onEnterPictureInPicture?.(
              details as MediaSessionPictureInPictureActionDetails
            )
          }
        : null,
      nexttrack: canGoNext
        ? () => {
            optionsRef.current.onNextTrack?.()
          }
        : null,
      pause: () => {
        optionsRef.current.onPause()
      },
      play: () => {
        void optionsRef.current.onPlay()
      },
      previoustrack: canGoPrevious
        ? () => {
            optionsRef.current.onPreviousTrack?.()
          }
        : null,
      seekbackward: (details) => {
        const currentOptions = optionsRef.current
        seekByOffset(
          currentOptions.getCurrentTime(),
          -(details.seekOffset ?? getSeekOffset(currentOptions)),
          currentOptions.onSeek,
          details
        )
      },
      seekforward: (details) => {
        const currentOptions = optionsRef.current
        seekByOffset(
          currentOptions.getCurrentTime(),
          details.seekOffset ?? getSeekOffset(currentOptions),
          currentOptions.onSeek,
          details
        )
      },
      seekto: (details) => {
        if (typeof details.seekTime !== "number") return

        const currentOptions = optionsRef.current
        const seekRange = currentOptions.getSeekRange?.()
        const seekTime = seekRange
          ? seekRange.start + details.seekTime
          : details.seekTime

        currentOptions.onSeek(seekTime, details)
      },
      skipad: canSkipAd
        ? () => {
            optionsRef.current.onSkipAd?.()
          }
        : null,
      stop: canStop
        ? () => {
            optionsRef.current.onStop?.()
          }
        : null,
    }),
    [canEnterPictureInPicture, canGoNext, canGoPrevious, canSkipAd, canStop]
  )
}

export function useMediaSessionSync({
  actions,
  active = true,
  metadata,
  playbackState,
  position,
}: UseMediaSessionSyncOptions): UseMediaSessionReturn {
  const mediaSession = useMediaSession()

  React.useEffect(() => {
    const cleanupHandlers = getActionEntries(actions).map(([action, handler]) =>
      mediaSession.setActionHandler(action, active ? (handler ?? null) : null)
    )

    return () => {
      cleanupHandlers.forEach((cleanup) => cleanup())
    }
  }, [actions, active, mediaSession])

  // Publish metadata after the current action set so platform UIs choose the
  // correct track-navigation or seek-control layout for this source. Republish
  // when actions change even if the metadata values stay the same.
  React.useEffect(() => {
    if (!active || !metadata) {
      mediaSession.clearMetadata()
      return
    }

    mediaSession.setMetadata(metadata)
  }, [actions, active, mediaSession, metadata])

  React.useEffect(() => {
    mediaSession.setPlaybackState(active ? (playbackState ?? "none") : "none")
  }, [active, mediaSession, playbackState])

  React.useEffect(() => {
    if (!active || !position) {
      mediaSession.clearPositionState()
      return
    }

    mediaSession.setPositionState(position)
  }, [active, mediaSession, position])

  React.useEffect(() => {
    return () => {
      mediaSession.clearMetadata()
      mediaSession.clearPositionState()
      mediaSession.setPlaybackState("none")
    }
  }, [mediaSession])

  return mediaSession
}

function getActionEntries(
  actions: MediaSessionActionHandlers | undefined
): [MediaSessionActionName, MediaSessionActionHandler | null | undefined][] {
  return Object.entries(actions ?? {}) as [
    MediaSessionActionName,
    MediaSessionActionHandler | null | undefined,
  ][]
}

function getMediaSession(): MediaSession | null {
  if (!isMediaSessionSupported()) return null

  const mediaSession = navigator.mediaSession as MediaSession | undefined

  return mediaSession ?? null
}

function getSafePosition(position: number, duration: number): number {
  return Number.isFinite(duration) ? Math.min(position, duration) : position
}

function getSeekOffset({
  seekOffset,
}: UseMediaSessionActionHandlersOptions): number {
  return seekOffset ?? DEFAULT_MEDIA_SESSION_SEEK_OFFSET_SECONDS
}

function hasNextMediaSessionPlaylistItem(
  playlist: MediaSessionPlaylistNavigation
): boolean {
  if (playlist.repeatMode === "all" && playlist.queue.length > 0) return true

  return playlist.getNextIndex() !== -1
}

function hasPreviousMediaSessionPlaylistItem(
  playlist: MediaSessionPlaylistNavigation
): boolean {
  if (playlist.repeatMode === "all" && playlist.queue.length > 0) return true

  return playlist.getPreviousIndex() !== -1
}

function isMediaSessionSupported(): boolean {
  return typeof navigator !== "undefined" && "mediaSession" in navigator
}

function isValidDuration(duration: number): boolean {
  return duration > 0 && (Number.isFinite(duration) || duration === Infinity)
}

function isValidPlaybackRate(playbackRate: number): boolean {
  return Number.isFinite(playbackRate) && playbackRate !== 0
}

function noop() {}

function normalizePositionState(
  state: MediaPositionState
): MediaPositionState | null {
  const nextState: MediaPositionState = {}
  const hasPositionData =
    typeof state.duration === "number" ||
    typeof state.playbackRate === "number" ||
    typeof state.position === "number"

  if (!hasPositionData) return nextState

  if (typeof state.duration !== "number" || !isValidDuration(state.duration)) {
    return null
  }

  nextState.duration = state.duration

  if (typeof state.playbackRate === "number") {
    if (!isValidPlaybackRate(state.playbackRate)) return null

    nextState.playbackRate = state.playbackRate
  }

  if (typeof state.position === "number") {
    if (!Number.isFinite(state.position) || state.position < 0) return null

    nextState.position = getSafePosition(state.position, nextState.duration)
  }

  return nextState
}

function seekByOffset(
  currentTime: number,
  offset: number,
  seek: (time: number, details: MediaSessionActionDetails) => void,
  details: MediaSessionActionDetails
) {
  if (!Number.isFinite(offset)) return
  if (!Number.isFinite(currentTime)) return

  seek(currentTime + offset, details)
}

function setSafeActionHandler(
  session: MediaSession,
  action: MediaSessionActionName,
  handler: MediaSessionActionHandler | null
) {
  try {
    session.setActionHandler(action as MediaSessionAction, handler)
  } catch (error) {
    console.warn(
      `[useMediaSession] Failed to set "${action}" action handler:`,
      error
    )
  }
}
