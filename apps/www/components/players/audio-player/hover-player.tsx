"use client"

import { ListMusicIcon, SquareArrowOutUpRightIcon } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

import {
  StreamPanel,
  StreamPanelProvider,
  useStreamPanel,
} from "@/components/stream-panel"
import { useStreamPanelSync } from "@/components/stream-panel/use-stream-panel-sync"
import { Button } from "@/components/ui/button"
import { type AgentState, Orb } from "@/components/ui/orb"
import { PopoverTrigger } from "@/components/ui/popover"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"

import { AudioPlayerDemo } from "./demo-player"

export function AudioPlayerHover() {
  return (
    <StreamPanelProvider>
      <AudioPlayerHoverContent />
    </StreamPanelProvider>
  )
}

function AudioHoverOrbSync({
  onAgentStateChange,
}: {
  onAgentStateChange: (agentState: AgentState) => void
}) {
  const status = usePlaybackStore((state) => state.status)

  useEffect(() => {
    if (status === "playing") {
      onAgentStateChange("talking")
      return
    }

    if (status === "buffering" || status === "loading") {
      onAgentStateChange("thinking")
      return
    }

    onAgentStateChange(null)
  }, [onAgentStateChange, status])

  return null
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
  const [orbAgentState, setOrbAgentState] = useState<AgentState>(null)
  const isAudioActive =
    orbAgentState === "talking" || orbAgentState === "thinking"

  const handleAgentStateChange = useCallback((agentState: AgentState) => {
    setOrbAgentState(agentState)
  }, [])

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
            <span aria-hidden="true" className="relative size-9 shrink-0">
              <Orb
                agentState={orbAgentState}
                className="relative size-full"
                colors={["#ED0040", "#F42A8B"]}
                manualInput={isAudioActive ? 0.55 : 0}
                manualOutput={isAudioActive ? 0.85 : 0}
                seed={1528}
                volumeMode="manual"
              />
            </span>
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
        <AudioHoverOrbSync onAgentStateChange={handleAgentStateChange} />
        <AudioHoverStreamPanel />
      </AudioPlayerDemo>
    </motion.div>
  )
}
