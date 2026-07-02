"use client"

import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/default/blocks/audio-player/components/button"
import {
  VolumeFullIcon,
  VolumeMutedIcon,
} from "@/registry/default/blocks/audio-player/components/icons"
import { useVolumeStore } from "@/registry/default/hooks/use-volume"
import { MuteControl } from "@/registry/default/ui/mute-control"
import * as VolumeSlider from "@/registry/default/ui/volume-control"

export function VolumeControl() {
  const muted = useVolumeStore((state) => state.muted)
  const volume = useVolumeStore((state) => state.level)

  const isMuted = muted || volume === 0

  return (
    <div className="group flex items-center gap-3">
      <VolumeSlider.Root
        className={cn(
          "relative flex h-3 w-0 cursor-pointer touch-none items-center select-none",
          `
            transition-[width] duration-200 ease-out
            group-hover:w-20
            focus-within:w-20
          `
        )}
      >
        <VolumeSlider.Track className="relative h-0.75 w-full overflow-hidden rounded-sm bg-secondary">
          <VolumeSlider.Progress className="absolute h-full bg-foreground" />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb
          className={cn(
            "absolute size-3 rounded-full bg-foreground opacity-0 transition-opacity",
            `
              group-hover:opacity-100
              focus-within:opacity-100
            `
          )}
        />
      </VolumeSlider.Root>
      <MuteControl asChild>
        <Button
          aria-label={muted ? "Unmute" : "Mute"}
          className="relative text-muted-foreground"
          title={muted ? "Unmute" : "Mute"}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
              className="flex items-center justify-center"
              exit={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
              initial={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
              key={isMuted ? "muted" : "unmuted"}
              transition={{ bounce: 0, duration: 0.3, type: "spring" }}
            >
              {isMuted ? (
                <VolumeMutedIcon aria-hidden="true" />
              ) : (
                <VolumeFullIcon aria-hidden="true" />
              )}
            </motion.span>
          </AnimatePresence>
        </Button>
      </MuteControl>
    </div>
  )
}
