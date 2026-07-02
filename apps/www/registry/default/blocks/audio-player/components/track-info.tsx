"use client"

import type { AudioPlayerAsset } from "@/registry/default/blocks/audio-player/player"

import { getAudioAssetMetadata } from "@/registry/default/blocks/audio-player/components/audio-source"
import { useAsset } from "@/registry/default/hooks/use-asset"
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"

export function TrackInfo() {
  const { currentItem } = useAsset<AudioPlayerAsset>()

  const asset = currentItem?.properties
  const metadata = getAudioAssetMetadata(asset)

  return (
    <div className="flex max-w-sm min-w-0 items-center gap-3">
      {metadata.poster ? (
        <div className="relative size-10 shrink-0 overflow-hidden rounded-sm bg-secondary outline-1 -outline-offset-1 outline-white/10">
          <img
            alt={`Album art for ${metadata.title}`}
            className="size-full object-cover"
            height={40}
            src={metadata.poster}
            width={40}
          />
        </div>
      ) : (
        <LimeplayLogo className="size-10" />
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm/snug font-medium text-secondary-foreground">
          {metadata.title}
        </div>
        {metadata.subtitle && (
          <div className="truncate text-xs/snug text-secondary-foreground/80">
            {metadata.subtitle}
          </div>
        )}
      </div>
    </div>
  )
}
