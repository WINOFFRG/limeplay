"use client"

import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/default/blocks/audio-player/components/button"
import {
  RepeatAllIcon,
  RepeatIcon,
  RepeatOneIcon,
  ShuffleOffIcon,
  ShuffleOneIcon,
} from "@/registry/default/blocks/audio-player/components/icons"
import {
  usePlaylist,
  usePlaylistStore,
} from "@/registry/default/hooks/use-playlist"

export function RepeatControl() {
  const { cycleRepeatMode } = usePlaylist()
  const repeatMode = usePlaylistStore((state) => state.repeatMode)
  const isActive = repeatMode !== "off"

  return (
    <Button
      aria-label={`Repeat: ${repeatMode}`}
      aria-pressed={isActive}
      className={cn({
        "text-secondary": !isActive,
      })}
      onClick={cycleRepeatMode}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
          className="flex items-center justify-center"
          exit={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
          initial={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
          key={repeatMode}
          transition={{ bounce: 0, duration: 0.3, type: "spring" }}
        >
          {repeatMode === "one" ? (
            <RepeatOneIcon aria-hidden="true" />
          ) : repeatMode === "off" ? (
            <RepeatIcon aria-hidden="true" />
          ) : (
            <RepeatAllIcon aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}

export function ShuffleControl() {
  const { toggleShuffle } = usePlaylist()
  const shuffle = usePlaylistStore((state) => state.shuffle)

  const handleToggleShuffle = () => {
    toggleShuffle()
  }

  return (
    <Button
      aria-label={shuffle ? "Shuffle on" : "Shuffle off"}
      aria-pressed={shuffle}
      className={cn({
        "text-secondary": !shuffle,
      })}
      onClick={handleToggleShuffle}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
          className="flex items-center justify-center"
          exit={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
          initial={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
          key={shuffle ? "on" : "off"}
          transition={{ bounce: 0, duration: 0.3, type: "spring" }}
        >
          {shuffle ? (
            <ShuffleOneIcon aria-hidden="true" />
          ) : (
            <ShuffleOffIcon aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}
