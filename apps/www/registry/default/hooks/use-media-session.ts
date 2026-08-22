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
  ) => MaybePromise<void>
  onNextTrack?: () => MaybePromise<void>
  onPause: () => MaybePromise<void>
  onPlay: () => MaybePromise<void>
  onPreviousTrack?: () => MaybePromise<void>
  onSeek: (
    time: number,
    details: MediaSessionActionDetails
  ) => MaybePromise<void>
  onSkipAd?: () => MaybePromise<void>
  onStop?: () => MaybePromise<void>
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
  claim?: boolean
  metadata?: MediaSessionMetadata | null
  playbackState?: MediaSessionPlaybackState
  position?: MediaPositionState | null
}

type MaybePromise<T> = Promise<T> | T

const DEFAULT_MEDIA_SESSION_SEEK_OFFSET_SECONDS = 10
const MEDIA_SESSION_OWNER_FALLBACK = Symbol("limeplay-media-session-owner")

let mediaSessionOwner: null | symbol = null
const mediaSessionOwnerListeners = new Set<() => void>()

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
  if (!isValidFiniteDuration(duration)) return null
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
            runMediaSessionAction(
              () =>
                optionsRef.current.onEnterPictureInPicture?.(
                  details as MediaSessionPictureInPictureActionDetails
                ),
              "enterpictureinpicture"
            )
          }
        : null,
      nexttrack: canGoNext
        ? () => {
            runMediaSessionAction(
              () => optionsRef.current.onNextTrack?.(),
              "nexttrack"
            )
          }
        : null,
      pause: () => {
        runMediaSessionAction(() => optionsRef.current.onPause(), "pause")
      },
      play: () => {
        runMediaSessionAction(() => optionsRef.current.onPlay(), "play")
      },
      previoustrack: canGoPrevious
        ? () => {
            runMediaSessionAction(
              () => optionsRef.current.onPreviousTrack?.(),
              "previoustrack"
            )
          }
        : null,
      seekbackward: (details) => {
        const currentOptions = optionsRef.current
        runMediaSessionAction(
          () =>
            seekByOffset(
              currentOptions.getCurrentTime(),
              -(details.seekOffset ?? getSeekOffset(currentOptions)),
              currentOptions.onSeek,
              details
            ),
          "seekbackward"
        )
      },
      seekforward: (details) => {
        const currentOptions = optionsRef.current
        runMediaSessionAction(
          () =>
            seekByOffset(
              currentOptions.getCurrentTime(),
              details.seekOffset ?? getSeekOffset(currentOptions),
              currentOptions.onSeek,
              details
            ),
          "seekforward"
        )
      },
      seekto: (details) => {
        if (typeof details.seekTime !== "number") return

        const currentOptions = optionsRef.current
        const seekRange = currentOptions.getSeekRange?.()
        const seekTime = seekRange
          ? seekRange.start + details.seekTime
          : details.seekTime

        runMediaSessionAction(
          () => currentOptions.onSeek(seekTime, details),
          "seekto"
        )
      },
      skipad: canSkipAd
        ? () => {
            runMediaSessionAction(
              () => optionsRef.current.onSkipAd?.(),
              "skipad"
            )
          }
        : null,
      stop: canStop
        ? () => {
            runMediaSessionAction(() => optionsRef.current.onStop?.(), "stop")
          }
        : null,
    }),
    [canEnterPictureInPicture, canGoNext, canGoPrevious, canSkipAd, canStop]
  )
}

export function useMediaSessionSync({
  actions,
  active = true,
  claim = false,
  metadata,
  playbackState,
  position,
}: UseMediaSessionSyncOptions): UseMediaSessionReturn {
  const mediaSession = useMediaSession()
  const owner = React.useRef<symbol>(MEDIA_SESSION_OWNER_FALLBACK)
  const currentOwner = React.useSyncExternalStore(
    subscribeMediaSessionOwner,
    getMediaSessionOwner,
    getServerMediaSessionOwner
  )
  const ownsMediaSession = active && currentOwner === owner.current

  if (owner.current === MEDIA_SESSION_OWNER_FALLBACK) {
    owner.current = Symbol("limeplay-media-session-owner")
  }

  React.useEffect(() => {
    if (!active) {
      if (getMediaSessionOwner() === owner.current) {
        mediaSession.clearMetadata()
        mediaSession.clearPositionState()
        mediaSession.setPlaybackState("none")
        releaseMediaSessionOwner(owner.current)
      }
      return
    }

    claimMediaSessionOwner(owner.current, claim)
  }, [active, claim, currentOwner, mediaSession])

  React.useEffect(() => {
    if (!ownsMediaSession) return

    const cleanupHandlers = getActionEntries(actions).map(([action, handler]) =>
      mediaSession.setActionHandler(action, handler ?? null)
    )

    return () => {
      if (getMediaSessionOwner() !== owner.current) return

      cleanupHandlers.forEach((cleanup) => cleanup())
    }
  }, [actions, mediaSession, ownsMediaSession])

  // Publish metadata after the current action set so platform UIs choose the
  // correct track-navigation or seek-control layout for this source. Republish
  // when actions change even if the metadata values stay the same.
  React.useEffect(() => {
    if (!ownsMediaSession) return

    if (!metadata) {
      mediaSession.clearMetadata()
      return
    }

    mediaSession.setMetadata(metadata)
  }, [actions, mediaSession, metadata, ownsMediaSession])

  React.useEffect(() => {
    if (!ownsMediaSession) return

    mediaSession.setPlaybackState(playbackState ?? "none")
  }, [mediaSession, ownsMediaSession, playbackState])

  React.useEffect(() => {
    if (!ownsMediaSession) return

    if (!position) {
      mediaSession.clearPositionState()
      return
    }

    mediaSession.setPositionState(position)
  }, [mediaSession, ownsMediaSession, position])

  React.useEffect(() => {
    return () => {
      if (getMediaSessionOwner() === owner.current) {
        mediaSession.clearMetadata()
        mediaSession.clearPositionState()
        mediaSession.setPlaybackState("none")
        releaseMediaSessionOwner(owner.current)
      }
    }
  }, [mediaSession])

  return mediaSession
}

function claimMediaSessionOwner(owner: symbol, force: boolean) {
  if (mediaSessionOwner === owner) return
  if (mediaSessionOwner !== null && !force) return

  mediaSessionOwner = owner
  notifyMediaSessionOwnerListeners()
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

function getMediaSessionOwner(): null | symbol {
  return mediaSessionOwner
}

function getSafePosition(position: number, duration: number): number {
  return Number.isFinite(duration) ? Math.min(position, duration) : position
}

function getSeekOffset({
  seekOffset,
}: UseMediaSessionActionHandlersOptions): number {
  return seekOffset ?? DEFAULT_MEDIA_SESSION_SEEK_OFFSET_SECONDS
}

function getServerMediaSessionOwner(): null | symbol {
  return null
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

function isValidFiniteDuration(duration: number): boolean {
  return Number.isFinite(duration) && duration > 0
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

  if (
    typeof state.duration !== "number" ||
    !isValidFiniteDuration(state.duration)
  ) {
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

function notifyMediaSessionOwnerListeners() {
  mediaSessionOwnerListeners.forEach((listener) => listener())
}

function releaseMediaSessionOwner(owner: symbol) {
  if (mediaSessionOwner !== owner) return

  mediaSessionOwner = null
  notifyMediaSessionOwnerListeners()
}

function runMediaSessionAction(
  action: () => MaybePromise<void>,
  name: MediaSessionActionName
) {
  try {
    void Promise.resolve(action()).catch((error) => {
      console.warn(`[useMediaSession] "${name}" action failed:`, error)
    })
  } catch (error) {
    console.warn(`[useMediaSession] "${name}" action failed:`, error)
  }
}

function seekByOffset(
  currentTime: number,
  offset: number,
  seek: (
    time: number,
    details: MediaSessionActionDetails
  ) => MaybePromise<void>,
  details: MediaSessionActionDetails
) {
  if (!Number.isFinite(offset)) return
  if (!Number.isFinite(currentTime)) return

  return seek(currentTime + offset, details)
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

function subscribeMediaSessionOwner(listener: () => void): () => void {
  mediaSessionOwnerListeners.add(listener)

  return () => {
    mediaSessionOwnerListeners.delete(listener)
  }
}
