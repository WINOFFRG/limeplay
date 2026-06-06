"use client"

import type { RefObject } from "react"

import { ChevronDownIcon, MonitorPlayIcon, RotateCwIcon } from "lucide-react"
import { useRef } from "react"
import { useFullscreen, useToggle } from "react-use"

import {
  StreamPanel,
  StreamPanelProvider,
  useStreamPanel,
} from "@/components/stream-panel"
import { getPlaylistPresetsForType } from "@/components/stream-panel/content-catalog"
import { useStreamPanelStore } from "@/components/stream-panel/use-stream-panel"
import { useStreamPanelSync } from "@/components/stream-panel/use-stream-panel-sync"
import { Button } from "@/components/ui/button"
import { PopoverTrigger } from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"
import { useOrientation } from "@/hooks/use-orientation"
import { getPresetsForType } from "@/lib/stream-presets"
import { cn } from "@/lib/utils"
import { VideoPlayer } from "@/registry/default/blocks/video-player/components/media-player"

export function VideoPlayerContainer() {
  const isMobile = useIsMobile()
  const { isPortrait } = useOrientation()
  const isMobilePortrait = isMobile && isPortrait
  const playerRef = useRef<HTMLDivElement>(null)

  return (
    <StreamPanelProvider>
      {isMobilePortrait && <RotateMessage playerRef={playerRef} />}
      <div className="relative w-full">
        <VideoPlayer
          className={cn(
            `
              dark mx-auto mt-6 overflow-hidden
              sm:mx-2 sm:my-0 sm:w-full
              md:mx-0
            `,
            isMobilePortrait &&
              `
                bg-black/90
                **:data-[layout-type='player-container']:hidden
              `
          )}
          mediaProps={{
            autoPlay: false,
            muted: true,
          }}
          ref={playerRef}
        >
          <HomeVideoStreamSelector />
        </VideoPlayer>
      </div>
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
          pointer-events-none absolute inset-x-0 top-4 z-30 flex justify-center px-4
          sm:top-6
        `}
      >
        <Button
          asChild
          className={`
            pointer-events-auto h-9 max-w-[min(20rem,calc(100vw-2rem))] rounded-full border border-white/12 bg-black/45 px-3 text-xs font-medium
            text-white shadow-2xl shadow-black/35 backdrop-blur-xl
          `}
          variant="ghost"
        >
          <PopoverTrigger aria-label="Open stream selector" handle={handle}>
            <MonitorPlayIcon className="size-3.5" />
            <span className="truncate">{selectedStreamName}</span>
            <ChevronDownIcon className="size-3.5 opacity-70" />
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

function RotateMessage({
  playerRef,
}: {
  playerRef: RefObject<HTMLDivElement | null>
}) {
  const [show, toggle] = useToggle(false)
  useFullscreen(playerRef as RefObject<Element>, show, {
    onClose: () => {
      toggle(false)
    },
  })

  const handleRotate = () => {
    toggle(true)
  }

  return (
    <div
      className={`
        absolute inset-0 z-50 flex items-center justify-center
        md:hidden
      `}
    >
      <div className={`mx-1 max-w-xs rounded-xl text-center`}>
        <h3 className="mb-2 text-sm font-medium text-neutral-100">
          Rotate to Landscape
        </h3>

        <p className="mb-4 text-xs/relaxed text-neutral-400">
          For the best viewing experience, rotate your device to landscape mode.
        </p>

        <Button
          className={`
            w-full border-neutral-700 bg-neutral-800/50 text-neutral-200
            hover:bg-neutral-700 hover:text-white
            disabled:opacity-50
          `}
          onClick={handleRotate}
          size="sm"
          variant="outline"
        >
          <RotateCwIcon className={`mr-2 size-3`} />
          Rotate
        </Button>
      </div>
    </div>
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
      ?.name ?? "Custom Stream"
  )
}
