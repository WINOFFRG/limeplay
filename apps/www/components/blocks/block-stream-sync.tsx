"use client"

import { useEffect, useMemo } from "react"

import type { StreamPanelPlayerType } from "@/components/stream-panel/use-stream-panel"

import { useStreamPanel } from "@/components/stream-panel"
import { useStreamPanelSync } from "@/components/stream-panel/use-stream-panel-sync"

export function BlockStreamSync({
  playerType = "video",
}: {
  playerType?: StreamPanelPlayerType
}) {
  const { registerController } = useStreamPanel()
  const { handleLoadStream, handlePlaylistPresetChange, handlePresetChange } =
    useStreamPanelSync({ playerType })

  const controller = useMemo(
    () => ({
      onLoadStream: handleLoadStream,
      onPlaylistChange: handlePlaylistPresetChange,
      onPresetChange: handlePresetChange,
      playerType,
    }),
    [
      handleLoadStream,
      handlePlaylistPresetChange,
      handlePresetChange,
      playerType,
    ]
  )

  useEffect(
    () => registerController(controller),
    [controller, registerController]
  )

  return null
}
