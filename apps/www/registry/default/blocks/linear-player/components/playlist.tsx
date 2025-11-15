"use client"

import { useState } from "react"
import { CardsThreeIcon, PlayIcon } from "@phosphor-icons/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/registry/default/blocks/linear-player/ui/button"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export interface DemoAsset {
  title: string
  description?: string
  poster: string
  src: string
  config?: shaka.extern.PlayerConfiguration
}

export const ASSETS: DemoAsset[] = [
  {
    title: "Blender Foundation - Sintel",
    description:
      "A Blender Foundation short film, protected by Widevine encryption",
    poster: "https://storage.googleapis.com/shaka-asset-icons/sintel.png",
    src: "https://storage.googleapis.com/shaka-demo-assets/sintel-widevine/dash.mpd",
    config: {
      drm: {
        servers: {
          "com.widevine.alpha": "https://cwip-shaka-proxy.appspot.com/no_auth",
        },
        advanced: {
          "com.widevine.alpha": {
            serverCertificateUri:
              "https://cwip-shaka-proxy.appspot.com/service-cert",
          },
        },
      } as unknown as shaka.extern.DrmConfiguration,
    } as shaka.extern.PlayerConfiguration,
  },
  {
    title: "Sing 2 Trailer",
    description: "Media Tailor HLS Stream",
    poster: "https://storage.googleapis.com/shaka-asset-icons/sing.png",
    src: "https://ad391cc0d55b44c6a86d232548adc225.mediatailor.us-east-1.amazonaws.com/v1/master/d02fedbbc5a68596164208dd24e9b48aa60dadc7/singssai/master.m3u8",
  },
  {
    title: "Big Buck Bunny",
    description: "A Blender Foundation short film, Media Tailor Live DASH",
    poster:
      "https://storage.googleapis.com/shaka-asset-icons/big_buck_bunny.png",
    src: "https://d305rncpy6ne2q.cloudfront.net/v1/dash/94063eadf7d8c56e9e2edd84fdf897826a70d0df/SFP-MediaTailor-Live-HLS-DASH/channel/sfp-channel1/dash.mpd",
  },
  {
    title: "National Geographic - VR equirectangular",
    description: "HLS Video",
    poster: "https://demo.theoplayer.com/hubfs/videos/natgeo/poster.jpg",
    src: "https://demo.theoplayer.com/hubfs/videos/natgeo/playlist.m3u8",
  },
]

export function Playlist() {
  const [currentAsset, setCurrentAsset] = useState<DemoAsset | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const player = useMediaStore((state) => state.player)
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
