"use client"

import {
  AudioLinesIcon,
  Settings2Icon,
  SquareArrowOutUpRightIcon,
} from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"

import {
  StreamPanel,
  StreamPanelProvider,
  useStreamPanel,
} from "@/components/stream-panel"
import { useStreamPanelSync } from "@/components/stream-panel/use-stream-panel-sync"
import { Button } from "@/components/ui/button"
import { PopoverTrigger } from "@/components/ui/popover"

import { AudioPlayerDemo } from "./demo-player"

export function AudioPlayerHover() {
  return (
    <StreamPanelProvider>
      <motion.div
        animate="closed"
        className="isolate"
        initial="closed"
        whileHover="open"
      >
        <motion.div
          className={`mx-auto block max-w-5xl`}
          style={{ transformOrigin: "bottom left" }}
          transition={{
            damping: 28,
            mass: 0.72,
            stiffness: 380,
            type: "spring",
          }}
          variants={{
            closed: { opacity: 0.98, scale: 0.985, y: 48 },
            open: { opacity: 1, scale: 1, y: 0 },
          }}
        >
          <div className="flex h-14 w-fit flex-row items-center gap-3 rounded-t-3xl bg-black px-4">
            <div className="flex w-full items-center justify-center gap-1">
              <span className="flex size-9 items-center justify-center rounded-full bg-white text-black">
                <AudioLinesIcon className="size-5" />
              </span>
              <span className="text-3xl font-semibold tracking-tight text-white">
                Audio
              </span>
            </div>
            <div className="my-auto h-8 w-0.5 rounded-md bg-muted-foreground"></div>
            <AudioSettingsTrigger />
            <Button asChild size="xs">
              <Link
                className="text-sm font-semibold tracking-tight"
                href="/blocks/audio-player"
              >
                Install Now
                <SquareArrowOutUpRightIcon className="ml-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
        <AudioPlayerDemo>
          <AudioHoverStreamSync />
        </AudioPlayerDemo>
      </motion.div>
    </StreamPanelProvider>
  )
}

function AudioHoverStreamSync() {
  const {
    handleLoadStream,
    handlePlaylistPresetChange,
    handlePresetChange,
  } = useStreamPanelSync({ playerType: "audio" })

  return (
    <StreamPanel
      align="end"
      onLoadStream={handleLoadStream}
      onPlaylistChange={handlePlaylistPresetChange}
      onPresetChange={handlePresetChange}
      playerType="audio"
      side="top"
      variant="anchored"
    />
  )
}

function AudioSettingsTrigger() {
  const { handle } = useStreamPanel()

  return (
    <Button
      aria-label="Audio settings"
      asChild
      className="
        size-8 rounded-full border border-border/40 bg-background/10 text-primary-foreground
        hover:bg-background/20
      "
      size="icon"
      variant="ghost"
    >
      <PopoverTrigger handle={handle}>
        <Settings2Icon className="size-4" />
      </PopoverTrigger>
    </Button>
  )
}
