"use client"

import type { AudioPlayerAsset } from "@/registry/default/blocks/audio-player/components/audio-source"

import { useAsset } from "@/registry/default/hooks/use-asset"

export function TrackInfo() {
  const { currentItem } = useAsset<AudioPlayerAsset>()

  const asset = currentItem?.properties
  const title = asset?.title ?? "No track playing"
  const genre = asset?.genre ?? ""

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative size-10 shrink-0 overflow-hidden rounded-sm bg-secondary outline-1 -outline-offset-1 outline-white/10">
        {asset?.poster ? (
          <img
            alt={`Album art for ${title}`}
            className="size-full object-cover"
            height={40}
            src={asset.poster}
            width={40}
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex size-full items-center justify-center text-secondary"
          >
            <svg
              aria-hidden="true"
              className="size-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm/snug font-medium text-secondary-foreground">
          {title}
        </div>
        {genre && (
          <div className="truncate text-xs/snug text-secondary">
            {genre} • 2026
          </div>
        )}
      </div>
    </div>
  )
}
