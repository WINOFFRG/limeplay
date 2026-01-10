"use client"

import type shaka from "shaka-player"

import { CardsThreeIcon, PlayIcon } from "@phosphor-icons/react"
import { useEffect } from "react"

import type { Asset } from "@/registry/default/hooks/use-asset"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/registry/default/blocks/linear-player/ui/button"
import { useAsset } from "@/registry/default/hooks/use-asset"
import { useMediaStore } from "@/registry/default/ui/media-provider"

/**
 * Demo assets for the linear-player
 */
export const ASSETS: Asset[] = [
  {
    config: {
      drm: {
        advanced: {
          "com.widevine.alpha": {
            serverCertificateUri:
              "https://cwip-shaka-proxy.appspot.com/service-cert",
          },
        },
        servers: {
          "com.widevine.alpha": "https://cwip-shaka-proxy.appspot.com/no_auth",
        },
      } as unknown as shaka.extern.DrmConfiguration,
    } as shaka.extern.PlayerConfiguration,
    description:
      "A Blender Foundation short film, protected by Widevine encryption",
    id: "sintel",
    poster: "https://storage.googleapis.com/shaka-asset-icons/sintel.png",
    src: "https://storage.googleapis.com/shaka-demo-assets/sintel-widevine/dash.mpd",
    title: "Blender Foundation - Sintel",
  },
  {
    description: "Media Tailor HLS Stream",
    id: "sing2",
    poster: "https://storage.googleapis.com/shaka-asset-icons/sing.png",
    src: "https://ad391cc0d55b44c6a86d232548adc225.mediatailor.us-east-1.amazonaws.com/v1/master/d02fedbbc5a68596164208dd24e9b48aa60dadc7/singssai/master.m3u8",
    title: "Sing 2 Trailer",
  },
  {
    description: "A Blender Foundation short film, Media Tailor Live DASH",
    id: "bbb",
    poster:
      "https://storage.googleapis.com/shaka-asset-icons/big_buck_bunny.png",
    src: "https://d305rncpy6ne2q.cloudfront.net/v1/dash/94063eadf7d8c56e9e2edd84fdf897826a70d0df/SFP-MediaTailor-Live-HLS-DASH/channel/sfp-channel1/dash.mpd",
    title: "Big Buck Bunny",
  },
  {
    description: "HLS Video",
    id: "natgeo",
    poster: "https://demo.theoplayer.com/hubfs/videos/natgeo/poster.jpg",
    src: "https://demo.theoplayer.com/hubfs/videos/natgeo/playlist.m3u8",
    title: "National Geographic - VR equirectangular",
  },
]

export function Playlist() {
  const currentItem = useMediaStore((state) => state.currentItem)
  const player = useMediaStore((state) => state.player)

  const { getCurrentItem, isPreloaded, loadPlaylist, preloadAsset, skipToId } =
    useAsset()

  useEffect(() => {
    if (!player) return

    loadPlaylist(ASSETS)
  }, [player])

  const handleAssetSelect = async (asset: Asset) => {
    await skipToId(asset.id)
  }

  const handleAssetHover = async (asset: Asset) => {
    if (!isPreloaded(asset.id) && getCurrentItem()?.id !== asset.id) {
      await preloadAsset(asset)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open Playlist" size="icon" variant="glass">
          <CardsThreeIcon weight="fill" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-12}
        className="dark w-sm border border-border p-2"
        side="top"
        sideOffset={24}
      >
        <DropdownMenuLabel>Playlist</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="space-y-2">
          {ASSETS.map((asset) => {
            const isCurrentAsset = currentItem?.id === asset.id
            const isAssetPreloaded = isPreloaded(asset.id)

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
                key={asset.id}
                onMouseEnter={() => handleAssetHover(asset)}
                onSelect={() => handleAssetSelect(asset)}
              >
                <div className="flex w-full items-center gap-3 p-2">
                  <div className="relative aspect-video w-20 shrink-0 overflow-hidden rounded">
                    <img
                      alt={asset.title}
                      className="object-cover"
                      sizes="80px"
                      src={asset.poster}
                    />
                    {isCurrentAsset && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <PlayIcon className="size-6 text-white" weight="fill" />
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
