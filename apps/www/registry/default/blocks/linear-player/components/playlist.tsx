"use client"

import { useState } from "react"
import { CardsThreeIcon, PlayIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ASSETS,
  type DemoAsset,
} from "@/registry/default/blocks/linear-player/lib/playlist"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export function Playlist() {
  const [currentAsset, setCurrentAsset] = useState<DemoAsset | null>(ASSETS[0])
  const [isOpen, setIsOpen] = useState(false)
  const player = useMediaStore((state) => state.player)
  const setStatus = useMediaStore((state) => state.setStatus)
  const setForceIdle = useMediaStore((state) => state.setForceIdle)
  const mediaRef = useMediaStore((state) => state.mediaRef)

  const handleAssetSelect = async (asset: DemoAsset) => {
    if (!player) {
      console.error("Shaka Player not initialized")
      return
    }

    try {
      if (asset.config) {
        player.configure(asset.config)
      }

      await player.load(asset.src)
      setCurrentAsset(asset)

      if (mediaRef.current?.paused) {
        await mediaRef.current.play()
      }
    } catch (error) {
      console.error("Error loading asset:", error)
      setStatus("error")
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setForceIdle(true)
    } else {
      setForceIdle(false)
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isOpen) {
      e.stopPropagation()
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="glass" aria-label="Open episodes">
          <CardsThreeIcon weight="fill" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="end"
        className="w-sm p-2"
        sideOffset={24}
        alignOffset={-12}
        onPointerDown={handlePointerDown}
      >
        <DropdownMenuLabel>
          Episodes
          <p className="mt-1 text-xs text-muted-foreground">
            This is a draft version of Playlist component
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="space-y-2">
          {ASSETS.map((asset, index) => {
            const isCurrentAsset = currentAsset?.src === asset.src
            return (
              <DropdownMenuItem
                key={index}
                className={`
                  p-0 transition-colors
                  ${
                    isCurrentAsset
                      ? "border-primary/20 bg-primary/10"
                      : "hover:bg-accent/50"
                  }
                `}
                onSelect={() => handleAssetSelect(asset)}
              >
                <div className="flex w-full items-center gap-3 p-2">
                  <div className="relative aspect-video w-20 shrink-0 overflow-hidden rounded">
                    <img
                      src={asset.poster}
                      alt={asset.title}
                      // fill
                      sizes="80px"
                      className="object-cover"
                      // priority={index < 2}
                    />
                    {isCurrentAsset && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <PlayIcon className="size-6 text-white" weight="fill" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-medium">
                        {asset.title}
                      </div>
                      {isCurrentAsset && (
                        <div className="flex size-2 rounded-full bg-primary" />
                      )}
                    </div>
                    {asset.description && (
                      <div className="line-clamp-2 text-xs text-muted-foreground">
                        {asset.description}
                      </div>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            )
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
