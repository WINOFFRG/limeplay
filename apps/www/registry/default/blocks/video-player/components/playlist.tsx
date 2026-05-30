"use client"

import { CardsThreeIcon, PlayIcon } from "@phosphor-icons/react"

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
import { useAsset } from "@/registry/default/hooks/use-asset"

export function Playlist() {
  const { currentItem, isPreloaded, orderedItems, preloadAsset, skipToId } =
    useAsset<VideoPlayerAsset>()

  const handleAssetSelect = async (assetId: string) => {
    await skipToId(assetId)
  }

  const handleAssetHover = async (assetId: string, asset: VideoPlayerAsset) => {
    if (!isPreloaded(assetId) && currentItem?.id !== assetId) {
      await preloadAsset(asset)
    }
  }

  return (
    <DropdownMenu>
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
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Playlist</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="space-y-2">
            {orderedItems.map((item) => {
              const asset = item.properties
              const isCurrentAsset = currentItem?.id === item.id
              const isAssetPreloaded = isPreloaded(item.id)

              return (
                <DropdownMenuItem
                  className={`
                    dark p-0 transition-colors
                    ${
                      isCurrentAsset
                        ? "border-primary/20 bg-primary/10"
                        : "hover:bg-accent/50"
                    }
                  `}
                  key={item.id}
                  onClick={() => handleAssetSelect(item.id)}
                  onMouseEnter={() => handleAssetHover(item.id, asset)}
                >
                  <div className="flex w-full items-center gap-3 p-2">
                    <div className="relative aspect-video w-20 shrink-0 overflow-hidden rounded-sm">
                      <img
                        alt={asset.title ?? "Playlist item poster"}
                        className="object-cover"
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
                      {isAssetPreloaded && !isCurrentAsset && (
                        <div className="absolute top-1 right-1 size-2 rounded-full bg-green-500" />
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
