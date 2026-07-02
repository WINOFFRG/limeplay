"use client"

import { ChevronDownIcon, MonitorPlayIcon } from "lucide-react"

import {
  StreamPanel,
  StreamPanelProvider,
  useStreamPanel,
} from "@/components/stream-panel"
import { useStreamPanelStore } from "@/components/stream-panel/use-stream-panel"
import { useStreamPanelSync } from "@/components/stream-panel/use-stream-panel-sync"
import { Button } from "@/components/ui/button"
import { PopoverTrigger } from "@/components/ui/popover"
import { getPlaylistPresetsForType } from "@/lib/catalogs"
import { getPresetsForType } from "@/lib/stream-presets"
import { cn } from "@/lib/utils"
import { VideoPlayer } from "@/registry/default/blocks/video-player/player"

export function VideoPlayerContainer() {
  return (
    <StreamPanelProvider>
      <VideoPlayer
        className={cn(
          `
            mx-auto mt-6 overflow-hidden
            sm:my-0 sm:w-full
            md:mx-0
          `
        )}
        mediaProps={{
          autoPlay: false,
          muted: true,
        }}
        theme="dark"
      >
        <HomeVideoStreamSelector />
      </VideoPlayer>
    </StreamPanelProvider>
  )
}

function HomeVideoStreamSelector() {
  const { handle } = useStreamPanel()
  const { handleLoadStream, handlePlaylistPresetChange, handlePresetChange } =
    useStreamPanelSync({ playerType: "video" })
  const selectedStreamName = useSelectedStreamName()

  return (
    <>
      <div
        className={`
          pointer-events-none absolute inset-x-0 top-3 z-30 flex justify-center px-3
          @md/root:top-4 @md/root:px-4
          @3xl/root:top-6
        `}
      >
        <Button
          asChild
          className={`
            pointer-events-auto h-8 max-w-[min(18rem,calc(100vw-1.5rem))] rounded-full border border-white/12 bg-black/45 px-2.5 text-xs font-medium
            text-white shadow-2xl shadow-black/35 backdrop-blur-xl
            @md/root:h-9 @md/root:max-w-[min(20rem,calc(100vw-2rem))] @md/root:px-3
            @3xl/root:h-10 @3xl/root:max-w-[min(24rem,calc(100vw-2rem))] @3xl/root:px-4 @3xl/root:text-sm
          `}
          variant="ghost"
        >
          <PopoverTrigger aria-label="Open stream selector" handle={handle}>
            <MonitorPlayIcon
              className="
                size-3
                @md/root:size-3.5
                @3xl/root:size-4
              "
            />
            <span className="truncate">{selectedStreamName}</span>
            <ChevronDownIcon
              className="
                size-3 opacity-70
                @md/root:size-3.5
                @3xl/root:size-4
              "
            />
          </PopoverTrigger>
        </Button>
      </div>

      <StreamPanel
        align="center"
        onLoadStream={handleLoadStream}
        onPlaylistChange={handlePlaylistPresetChange}
        onPresetChange={handlePresetChange}
        playerType="video"
        side="bottom"
        variant="anchored"
      />
    </>
  )
}

function useSelectedStreamName() {
  const selection = useStreamPanelStore((s) => s.contentSelections.video)
  if (!selection) return "Choose Stream"

  if (selection.kind === "playlist") {
    return (
      getPlaylistPresetsForType("video").find(
        (playlist) => playlist.id === selection.id
      )?.name ?? "Choose Stream"
    )
  }

  return (
    getPresetsForType("video").find((preset) => preset.id === selection.id)
      ?.title ?? "Custom Stream"
  )
}
