"use client"

import type { ComponentType, SVGProps } from "react"

import { IconSatellite1 } from "@central-icons-react/round-filled-radius-0-stroke-1/IconSatellite1"
import { IconVideoClip } from "@central-icons-react/round-filled-radius-0-stroke-1/IconVideoClip"
import { IconVideos } from "@central-icons-react/round-filled-radius-0-stroke-1/IconVideos"
import { ChevronRightIcon } from "lucide-react"

import type {
  StreamPanelContentKind,
  StreamPanelPlayerType,
} from "@/components/stream-panel/use-stream-panel"

import { cn } from "@/lib/utils"

import { Separator } from "../ui/separator"
import { OverlayShell, type OverlayShellPlacement } from "./overlay-shell"

interface ContentOverviewOverlayProps {
  liveCount: number
  onBack: () => void
  onSelect: (kind: StreamPanelContentKind) => void
  placement?: OverlayShellPlacement
  playerType: StreamPanelPlayerType
  playlistCount: number
  show: boolean
  streamCount: number
}

type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & {
    size?: number | string
  }
>

const rows: {
  description: string
  Icon: IconComponent
  kind: StreamPanelContentKind
  label: string
}[] = [
  {
    description: "Adaptive and progressive test content",
    Icon: IconVideoClip,
    kind: "stream",
    label: "Streams",
  },
  {
    description: "Curated multi-item queues",
    Icon: IconVideos,
    kind: "playlist",
    label: "Playlists",
  },
  {
    description: "Time-based live manifests",
    Icon: IconSatellite1,
    kind: "live",
    label: "Live",
  },
]

export function ContentOverviewOverlay({
  liveCount,
  onBack,
  onSelect,
  placement,
  playerType,
  playlistCount,
  show,
  streamCount,
}: ContentOverviewOverlayProps) {
  const counts: Record<StreamPanelContentKind, number> = {
    live: liveCount,
    playlist: playlistCount,
    stream: streamCount,
  }

  return (
    <OverlayShell
      onBack={onBack}
      placement={placement}
      show={show}
      title={playerType === "audio" ? "Audio Presets" : "Video Presets"}
    >
      <Separator className="my-1 h-px" />
      <div className="flex flex-col gap-1.5 p-2 pt-1">
        <div className="flex flex-col gap-1.5">
          {rows.map((row) => {
            const count = counts[row.kind]
            const disabled = count === 0

            return (
              <button
                className={cn(
                  `
                    group flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-lg px-2 text-left outline-hidden
                    transition-[background-color,transform,color]
                    hover:bg-foreground/4
                    focus-visible:bg-foreground/4
                    active:scale-[0.985]
                  `,
                  disabled && "pointer-events-none opacity-45"
                )}
                disabled={disabled}
                key={row.kind}
                onClick={() => onSelect(row.kind)}
                type="button"
              >
                <span
                  className="
                    flex size-7 shrink-0 items-center justify-center text-muted-foreground transition-colors
                    group-hover:text-foreground
                  "
                >
                  <row.Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-medium tracking-tight">
                      {row.label}
                    </span>
                    <span className="text-[10px] leading-none font-medium text-muted-foreground">
                      {count}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {row.description}
                  </span>
                </span>
                <ChevronRightIcon
                  className="
                    size-3.5 shrink-0 text-muted-foreground transition-transform
                    group-hover:translate-x-0.5
                  "
                />
              </button>
            )
          })}
        </div>
      </div>
    </OverlayShell>
  )
}
