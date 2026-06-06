"use client"

import { IconVoiceHigh } from "@central-icons-react/round-filled-radius-0-stroke-1/IconVoiceHigh"
import { ListMusicIcon, SquareArrowOutUpRightIcon } from "lucide-react"
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
      <AudioPlayerHoverContent />
    </StreamPanelProvider>
  )
}

function AudioHoverStreamPanel() {
  const { handleLoadStream, handlePlaylistPresetChange, handlePresetChange } =
    useStreamPanelSync({ playerType: "audio" })

  return (
    <StreamPanel
      align="start"
      onLoadStream={handleLoadStream}
      onPlaylistChange={handlePlaylistPresetChange}
      onPresetChange={handlePresetChange}
      playerType="audio"
      side="top"
      variant="anchored"
    />
  )
}

function AudioHoverStreamTrigger() {
  const { handle } = useStreamPanel()

  return (
    <Button asChild size="xs" variant="secondary">
      <PopoverTrigger aria-label="Open audio library" handle={handle}>
        <ListMusicIcon className="size-3.5" />
        Library
      </PopoverTrigger>
    </Button>
  )
}

function AudioPlayerHoverContent() {
  const { open } = useStreamPanel()

  return (
    <motion.div
      animate={open ? "open" : "closed"}
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
            <IconVoiceHigh className="size-8 text-white" />
            <span className="text-3xl font-semibold tracking-tight text-white">
              Audio
            </span>
          </div>
          <div className="my-auto h-8 w-0.5 rounded-md bg-muted-foreground"></div>
          <AudioHoverStreamTrigger />
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
        <AudioHoverStreamPanel />
      </AudioPlayerDemo>
    </motion.div>
  )
}
