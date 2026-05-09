"use client"

import { XIcon } from "lucide-react"

import { type SavedStream, useDocsDialStore } from "@/lib/docs-dial-store"
import { cn } from "@/lib/utils"

import { Button } from "../ui/button"
import { OverlayShell } from "./overlay-shell"

interface SavedOverlayProps {
  onBack: () => void
  onSelect: (stream: SavedStream) => void
  show: boolean
}

export function SavedOverlay({ onBack, onSelect, show }: SavedOverlayProps) {
  const savedStreams = useDocsDialStore((s) => s.savedStreams)
  const removeSavedStream = useDocsDialStore((s) => s.removeSavedStream)
  const customSrc = useDocsDialStore((s) => s.customSrc)

  return (
    <OverlayShell onBack={onBack} show={show} title="Saved Streams">
      <div className="no-scrollbar flex-1 overflow-y-auto p-2">
        {savedStreams.map((stream) => (
          <div
            className={cn(
              "group",
              `
                relative flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-hidden transition-[colors,transform] select-none
                hover:bg-accent/70 hover:text-accent-foreground
                focus:bg-accent/70 focus:text-accent-foreground
                active:scale-[0.985]
              `,
              stream.src === customSrc &&
                "bg-accent/85 font-medium text-accent-foreground"
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
              className={`size-3.5`}
              onClick={() => removeSavedStream(stream.id)}
              size="icon"
              variant="ghost"
            >
              <XIcon className="size-3" />
            </Button>
          </div>
        ))}
      </div>
    </OverlayShell>
  )
}
