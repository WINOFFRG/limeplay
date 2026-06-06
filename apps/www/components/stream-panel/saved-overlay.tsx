"use client"

import { PlusIcon, XIcon } from "lucide-react"

import { type SavedStream, useStreamPanelStore } from "@/lib/docs-dial-store"
import { cn } from "@/lib/utils"

import { Button } from "../ui/button"
import { OverlayShell, type OverlayShellPlacement } from "./overlay-shell"

interface SavedOverlayProps {
  onAddCustom: () => void
  onBack: () => void
  onSelect: (stream: SavedStream) => void
  placement?: OverlayShellPlacement
  show: boolean
}

export function SavedOverlay({
  onAddCustom,
  onBack,
  onSelect,
  placement,
  show,
}: SavedOverlayProps) {
  const savedStreams = useStreamPanelStore((s) => s.savedStreams)
  const removeSavedStream = useStreamPanelStore((s) => s.removeSavedStream)
  const customSrc = useStreamPanelStore((s) => s.customSrc)

  return (
    <OverlayShell
      onBack={onBack}
      placement={placement}
      show={show}
      title="Saved Streams"
    >
      <div className="no-scrollbar flex-1 overflow-y-auto p-2 pt-1">
        <button
          className={`
            group relative flex w-full items-center gap-3 rounded-[18px] px-2.5 py-2 text-sm outline-hidden
            transition-[background-color,color,transform] select-none
            hover:bg-foreground/4
            focus-visible:bg-foreground/4
            active:scale-[0.985]
          `}
          onClick={onAddCustom}
          type="button"
        >
          <span
            className="
              flex size-7 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors
              group-hover:text-foreground
            "
          >
            <PlusIcon className="size-4" />
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate font-medium tracking-tight">
              Add Custom
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              Paste a manifest URL
            </span>
          </span>
        </button>

        {savedStreams.map((stream) => (
          <div
            className={cn(
              "group",
              `
                relative flex w-full items-center gap-2 rounded-[18px] px-2.5 py-2 text-sm outline-hidden
                transition-[background-color,color,transform] select-none
                hover:bg-foreground/4
                focus:bg-foreground/4
                active:scale-[0.985]
              `,
              stream.src === customSrc && "font-medium"
            )}
            key={stream.id}
          >
            <button
              className="min-w-0 flex-1 text-left"
              onClick={() => onSelect(stream)}
              type="button"
            >
              <span className="block truncate">{stream.name}</span>
            </button>
            <Button
              aria-label={`Remove ${stream.name}`}
              className="
                size-7 rounded-xl text-muted-foreground
                hover:bg-foreground/4 hover:text-foreground
              "
              onClick={() => removeSavedStream(stream.id)}
              size="icon"
              variant="ghost"
            >
              <XIcon className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </OverlayShell>
  )
}
