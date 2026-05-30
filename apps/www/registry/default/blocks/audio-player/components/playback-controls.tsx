"use client"

import { CircleNotchIcon } from "@phosphor-icons/react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/registry/default/blocks/audio-player/components/button"
import {
  NextIcon,
  PauseIcon,
  PlayIcon,
  PreviousIcon,
} from "@/registry/default/blocks/audio-player/components/icons"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"
import { RECOMMENDED_PLAYER_BUFFERING_THROTTLE_MS } from "@/registry/default/hooks/use-player"
import { usePlaylist } from "@/registry/default/hooks/use-playlist"
import { PlaybackControl } from "@/registry/default/ui/playback-control"

export function PlaybackControls() {
  const status = usePlaybackStore((state) => state.status)
  const { hasNext, hasPrevious, next, previous } = usePlaylist()

  const rawBuffering = status === "buffering" || status === "loading"
  const { isBuffering, isPlaying } = useStablePlaybackState(
    rawBuffering,
    status,
    RECOMMENDED_PLAYER_BUFFERING_THROTTLE_MS
  )

  return (
    <div className="flex items-center gap-1">
      <Button
        aria-label="Previous track"
        disabled={!hasPrevious}
        onClick={previous}
      >
        <PreviousIcon aria-hidden="true" />
      </Button>

      <PlaybackControl asChild>
        <Button aria-label={isPlaying ? "Pause" : "Play"} size="xl">
          <AnimatedIcon
            id={isBuffering ? "loading" : isPlaying ? "pause" : "play"}
          >
            {isBuffering ? (
              <CircleNotchIcon
                aria-hidden="true"
                className="animate-spin"
                size={6}
              />
            ) : isPlaying ? (
              <PauseIcon aria-hidden="true" />
            ) : (
              <PlayIcon aria-hidden="true" className="relative left-px" />
            )}
          </AnimatedIcon>
        </Button>
      </PlaybackControl>

      <Button aria-label="Next track" disabled={!hasNext} onClick={next}>
        <NextIcon aria-hidden="true" />
      </Button>
    </div>
  )
}

function AnimatedIcon({
  children,
  id,
}: {
  children: React.ReactNode
  id: string
}) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        // animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
        // className="flex items-center justify-center"
        // exit={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
        // initial={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
        key={id}
        layout
        transition={{ bounce: 0, duration: 0.3, type: "spring" }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  )
}

function useStablePlaybackState(
  isBuffering: boolean,
  status: string,
  delayMs: number
) {
  const [showSpinner, setShowSpinner] = useState(false)
  const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null)
  const lastIntentRef = useRef<string>("paused")

  useEffect(() => {
    if (status === "playing" || status === "paused") {
      lastIntentRef.current = status
    }
  }, [status])

  useEffect(() => {
    if (isBuffering && lastIntentRef.current === "playing") {
      timeoutRef.current = setTimeout(() => setShowSpinner(true), delayMs)
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setShowSpinner(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [isBuffering, delayMs])

  // During transient buffering, hold the last intent as the visual state
  const stableIsPlaying = isBuffering
    ? lastIntentRef.current === "playing"
    : status === "playing"

  return { isBuffering: showSpinner, isPlaying: stableIsPlaying }
}
