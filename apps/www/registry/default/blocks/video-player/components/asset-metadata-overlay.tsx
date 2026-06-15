"use client"

import type { VideoPlayerAsset } from "@/registry/default/blocks/video-player/components/media-player"

import { useAsset } from "@/registry/default/hooks/use-asset"
import { ControlsTopContainer } from "@/registry/default/ui/player-layout"

export function AssetMetadataOverlay() {
  const { currentItem } = useAsset<VideoPlayerAsset>()
  const asset = currentItem?.properties
  const description = asset?.description?.trim()
  const title = asset?.title?.trim()

  if (!title && !description) return null

  return (
    <>
      <div
        className={`
          pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.84),transparent_84%)] transition-opacity duration-300 ease-out
          group-data-[idle=true]/root:opacity-0
          group-data-[status=buffering]/root:opacity-100
          group-data-[status=paused]/root:opacity-100
        `}
        data-layout-type="asset-metadata-gradient-focus"
      />
      <ControlsTopContainer
        className="pointer-events-none text-white"
        data-layout-type="asset-metadata-overlay"
      >
        <div className="max-w-md">
          {title && (
            <h2 className="line-clamp-2 text-lg/tight font-semibold tracking-normal text-balance drop-shadow-[0_3px_18px_rgba(0,0,0,0.86)]">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 line-clamp-2 max-w-sm text-sm/relaxed text-pretty text-white/80 drop-shadow-[0_2px_14px_rgba(0,0,0,0.78)]">
              {description}
            </p>
          )}
        </div>
      </ControlsTopContainer>
    </>
  )
}
