"use client"

import type { RefObject } from "react"
import { useRef } from "react"
import { useSearchParams } from "next/navigation"
import { RotateCw } from "lucide-react"
import { useFullscreen, useToggle } from "react-use"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { useOrientation } from "@/hooks/use-orientation"
import { Button } from "@/components/ui/button"
import { LinearMediaPlayer } from "@/registry/default/blocks/linear-player/media-player"

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

        <p className="mb-4 text-xs leading-relaxed text-neutral-400">
          For the best viewing experience, rotate your device to landscape mode.
        </p>

        <Button
          onClick={handleRotate}
          size="sm"
          variant="outline"
          className={`
            w-full border-neutral-700 bg-neutral-800/50 text-neutral-200
            hover:bg-neutral-700 hover:text-white
            disabled:opacity-50
          `}
        >
          <RotateCw className={`mr-2 h-3 w-3`} />
          Rotate
        </Button>
      </div>
    </div>
  )
}

export function PlayerContainer() {
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  const { isPortrait } = useOrientation()
  const isMobilePortrait = isMobile && isPortrait
  const playerRef = useRef<HTMLDivElement>(null)

  const playbackUrl =
    searchParams.get("playbackUrl") ??
    "https://ad391cc0d55b44c6a86d232548adc225.mediatailor.us-east-1.amazonaws.com/v1/master/d02fedbbc5a68596164208dd24e9b48aa60dadc7/singssai/master.m3u8"
  const debug = searchParams.get("debug") === "true"

  return (
    <>
      {isMobilePortrait && <RotateMessage playerRef={playerRef} />}
      <LinearMediaPlayer
        src={playbackUrl}
        debug={debug}
        className={cn(
          `
            mx-auto w-[calc(100%-2rem)] rounded-xl
            sm:mx-2 sm:w-full
            md:mx-0 overflow-hidden
          `,
          isMobilePortrait &&
            `
              bg-black/90
              [&_[data-layout-type='player-container']]:hidden
            `
        )}
        ref={playerRef}
      />
    </>
  )
}
