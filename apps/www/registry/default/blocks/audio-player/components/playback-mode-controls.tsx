"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useMemo } from "react"

import type { RepeatMode } from "@/registry/default/hooks/use-playlist"

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

type RepeatControlVariant = "asset" | "playlist"

const REPEAT_MODES: Record<RepeatControlVariant, RepeatMode[]> = {
  asset: ["off", "one"],
  playlist: ["off", "all", "one"],
}

export function RepeatControl({
  variant = "playlist",
}: {
  variant?: RepeatControlVariant
}) {
  const { setRepeatMode } = usePlaylist()
  const repeatMode = usePlaylistStore((state) => state.repeatMode)
  const modes = REPEAT_MODES[variant]
  const normalizedRepeatMode = useMemo(
    () => normalizeRepeatMode(repeatMode, modes),
    [modes, repeatMode]
  )
  const isActive = normalizedRepeatMode !== "off"

  useEffect(() => {
    if (repeatMode === normalizedRepeatMode) return
    setRepeatMode(normalizedRepeatMode)
  }, [normalizedRepeatMode, repeatMode, setRepeatMode])

  const handleCycleRepeatMode = () => {
    const modeIndex = modes.indexOf(normalizedRepeatMode)
    const nextMode = modes[(modeIndex + 1) % modes.length] ?? "off"
    setRepeatMode(nextMode)
  }

  return (
    <Button
      aria-label={`Repeat: ${normalizedRepeatMode}`}
      aria-pressed={isActive}
      className={cn({
        "text-secondary": !isActive,
      })}
      onClick={handleCycleRepeatMode}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
          className="flex items-center justify-center"
          exit={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
          initial={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
          key={normalizedRepeatMode}
          transition={{ bounce: 0, duration: 0.3, type: "spring" }}
        >
          {normalizedRepeatMode === "one" ? (
            <RepeatOneIcon aria-hidden="true" />
          ) : normalizedRepeatMode === "off" ? (
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

function normalizeRepeatMode(
  mode: RepeatMode,
  modes: RepeatMode[]
): RepeatMode {
  if (modes.includes(mode)) return mode
  if (mode === "all" && modes.includes("one")) return "one"
  return modes[0] ?? "off"
}
