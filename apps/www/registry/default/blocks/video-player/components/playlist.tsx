"use client"

import { CardsThreeIcon, PlayIcon } from "@phosphor-icons/react"
import { type ComponentProps, useEffect, useMemo } from "react"

import type { VideoPlayerAsset } from "@/registry/default/blocks/video-player/components/media-player"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/registry/default/blocks/video-player/components/button"
import { useMediaStore } from "@/registry/default/hooks/use-media"
import { usePlayerStore } from "@/registry/default/hooks/use-player"
import { usePlaylistStore } from "@/registry/default/hooks/use-playlist"

export function Playlist() {
  const currentItem = usePlaylistStore(
    (state) =>
      state.currentItem as null | { id: string; properties: VideoPlayerAsset }
  )
  const containerRef = usePlayerStore((state) => state.containerRef)
  const setForceIdle = useMediaStore((state) => state.setForceIdle)
  const queue = usePlaylistStore(
    (state) => state.queue as { id: string; properties: VideoPlayerAsset }[]
  )
  const shuffle = usePlaylistStore((state) => state.shuffle)
  const shuffleOrder = usePlaylistStore((state) => state.shuffleOrder)
  const skipToId = usePlaylistStore((state) => state.skipToId)

  const orderedItems = useMemo(() => {
    if (!shuffle || shuffleOrder.length === 0) return queue

    return shuffleOrder
      .map((index) => queue[index])
      .filter((item): item is { id: string; properties: VideoPlayerAsset } =>
        Boolean(item)
      )
  }, [queue, shuffle, shuffleOrder])

  useEffect(() => {
    return () => {
      setForceIdle(false)
    }
  }, [setForceIdle])

  if (orderedItems.length < 2) return null

  const handleAssetSelect = async (assetId: string) => {
    await skipToId(assetId)
  }

  const dropdownCollisionProps = {
    collisionBoundary: containerRef ?? undefined,
    collisionPadding: 12,
  }

  return (
    <DropdownMenu onOpenChange={setForceIdle}>
      <Button aria-label="Open Playlist" asChild size="icon" variant="glass">
        <DropdownMenuTrigger>
          <CardsThreeIcon weight="fill" />
        </DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent
        align="end"
        alignOffset={-12}
        className="dark w-sm border border-border p-2"
        side="top"
        sideOffset={24}
        {...(dropdownCollisionProps as unknown as ComponentProps<
          typeof DropdownMenuContent
        >)}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Playlist</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="space-y-1">
            {orderedItems.map((item) => {
              const asset = item.properties
              const isCurrentAsset = currentItem?.id === item.id

              return (
                <DropdownMenuItem
                  className={`
                    dark cursor-pointer rounded-md p-0 transition-colors
                    focus:bg-accent/50 focus:outline-none
                    ${
                      isCurrentAsset
                        ? "border-primary/20 bg-primary/10"
                        : "hover:bg-accent/50"
                    }
                  `}
                  key={item.id}
                  onClick={() => handleAssetSelect(item.id)}
                >
                  <div className="flex w-full items-center gap-3 p-2">
                    <div className="relative aspect-video w-20 shrink-0 overflow-hidden rounded-sm">
                      <img
                        alt={asset.title ?? "Playlist item poster"}
                        className="object-cover"
                        loading="lazy"
                        sizes="80px"
                        src={asset.poster}
                      />
                      {isCurrentAsset && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <PlayIcon
                            className="size-6 text-white"
                            weight="fill"
                          />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex w-full items-center gap-2">
                        <div className="min-w-0 flex-1 truncate text-sm font-medium">
                          {asset.title}
                        </div>
                        {isCurrentAsset && (
                          <div className="size-2 shrink-0 rounded-full bg-primary" />
                        )}
                        <span
                          className="ml-auto shrink-0 text-[11px] text-muted-foreground tabular-nums"
                          title={String(asset.year)}
                        >
                          {asset.year}
                        </span>
                      </div>
                      {asset.description && (
                        <div className="line-clamp-2 text-[11px] text-muted-foreground">
                          {asset.description}
                        </div>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            })}
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
