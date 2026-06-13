"use client"

import { CardsThreeIcon, PlayIcon } from "@phosphor-icons/react"
import { Volume2Icon } from "lucide-react"
import { useCallback, useMemo, useRef } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  type AudioPlayerAsset,
  getAudioAssetMetadata,
  useAudioSource,
} from "@/registry/default/blocks/audio-player/components/audio-source"
import { Button } from "@/registry/default/blocks/audio-player/components/button"
import { usePlayerStore } from "@/registry/default/hooks/use-player"
import { usePlaylistStore } from "@/registry/default/hooks/use-playlist"
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"

export function Playlist() {
  const currentItem = usePlaylistStore(
    (state) =>
      state.currentItem as null | { id: string; properties: AudioPlayerAsset }
  )
  const preloadManagers = usePlayerStore((state) => state.preloadManagers)
  const queue = usePlaylistStore(
    (state) => state.queue as { id: string; properties: AudioPlayerAsset }[]
  )
  const shuffle = usePlaylistStore((state) => state.shuffle)
  const shuffleOrder = usePlaylistStore((state) => state.shuffleOrder)
  const skipToId = usePlaylistStore((state) => state.skipToId)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { items } = useAudioSource()
  const orderedItems = useMemo(() => {
    if (!shuffle || shuffleOrder.length === 0) return queue

    return shuffleOrder
      .map((index) => queue[index])
      .filter((item): item is { id: string; properties: AudioPlayerAsset } =>
        Boolean(item)
      )
  }, [queue, shuffle, shuffleOrder])

  const displayAssets = useMemo(() => {
    if (orderedItems.length > 0)
      return orderedItems.map((item) => ({
        asset: item.properties,
        id: item.id,
      }))
    return items.map((asset, index) => ({
      asset,
      id:
        asset.id ??
        asset.src ??
        asset.playbackUrls?.primary ??
        `asset:${index}`,
    }))
  }, [orderedItems, items])

  const handleAssetSelect = useCallback(
    (assetId: string) => {
      skipToId(assetId)
    },
    [skipToId]
  )

  const scrollToActive = useCallback(() => {
    const container = scrollRef.current
    if (!container || !currentItem) return
    const activeEl = container.querySelector("[data-active='true']")
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "instant", block: "center" })
    }
  }, [currentItem])

  return (
    <DropdownMenu>
      <Button aria-label="Open Playlist" asChild>
        <DropdownMenuTrigger>
          <CardsThreeIcon weight="fill" />
        </DropdownMenuTrigger>
      </Button>

      <DropdownMenuContent
        align="end"
        alignOffset={-8}
        className="dark w-85 rounded-2xl bg-[#212121] p-0 shadow-2xl ring-1 shadow-black/80 ring-white/8"
        onAnimationEnd={scrollToActive}
        side="top"
        sideOffset={20}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-[12px] font-semibold tracking-widest text-white/30 uppercase">
            Queue
          </h2>
          <div className="flex items-center gap-3">
            {shuffle && (
              <span className="text-[10px] font-medium tracking-wider text-white/20 uppercase">
                Shuffled
              </span>
            )}
            <span className="text-[11px] text-white/20 tabular-nums">
              {displayAssets.length} tracks
            </span>
          </div>
        </div>

        <div
          className={`
            relative max-h-100 overflow-y-auto overscroll-contain
            mask-[linear-gradient(to_bottom,transparent,black_8px,black_calc(100%-8px),transparent)] px-2 pb-3
          `}
          ref={scrollRef}
          style={{ scrollbarWidth: "none" }}
        >
          {displayAssets.length === 0 && (
            <div className="py-14 text-center text-[13px] text-white/15">
              Queue is empty
            </div>
          )}

          {displayAssets.map(({ asset, id }, index) => (
            <TrackRow
              asset={asset}
              index={index}
              isActive={currentItem?.id === id}
              key={id}
              onSelect={() => handleAssetSelect(id)}
              preloaded={preloadManagers.has(id)}
              setSize={displayAssets.length}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function formatDuration(ms?: number) {
  if (typeof ms !== "number" || !Number.isFinite(ms)) return "--:--"

  const secs = Math.floor(ms / 1000)
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

function TrackRow({
  asset,
  index,
  isActive,
  onSelect,
  preloaded,
  setSize,
}: {
  asset: AudioPlayerAsset
  index: number
  isActive: boolean
  onSelect: () => void
  preloaded: boolean
  setSize: number
}) {
  const metadata = getAudioAssetMetadata(asset, "Untitled track")

  return (
    <Button
      aria-posinset={index + 1}
      aria-setsize={setSize}
      className={cn(
        `
          group relative flex h-auto w-full cursor-pointer items-center gap-4 rounded-lg px-3 py-2.5 text-left transition-[color,background-color]
          duration-150 ease-out outline-none
        `,
        isActive ? "bg-white/[0.07]" : "hover:bg-white/4"
      )}
      data-active={isActive}
      onClick={onSelect}
    >
      <div className="relative size-10 shrink-0 overflow-hidden rounded-sm bg-white/4 outline-1 -outline-offset-1 outline-white/10">
        {metadata.poster && (
          <img
            alt=""
            className="absolute inset-0 size-full object-cover"
            src={metadata.poster}
          />
        )}
        {!metadata.poster && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center text-white/35"
          >
            <LimeplayLogo className="size-5" />
          </div>
        )}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-[background-color] duration-150 ease-out",
            isActive
              ? "bg-black/50"
              : `
                bg-black/0
                group-hover:bg-black/50
              `
          )}
        >
          {isActive ? (
            <Volume2Icon className="size-4 text-white drop-shadow-md" />
          ) : (
            <PlayIcon
              className={`
                size-4 text-white opacity-0 drop-shadow-md transition-[opacity,transform] duration-150 ease-out
                group-hover:scale-100 group-hover:opacity-100
              `}
              style={{ transform: "scale(0.5)" }}
              weight="fill"
            />
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="w-4 shrink-0 text-[10px] text-white/25 tabular-nums">
            {index + 1}
          </span>
          <p
            className={cn(
              "truncate text-[13px] leading-snug",
              isActive
                ? "font-medium text-white"
                : `
                  text-white/70
                  group-hover:text-white/80
                `
            )}
          >
            {metadata.title}
          </p>
          {preloaded && !isActive && (
            <span className="size-1.5 shrink-0 rounded-full bg-white/30" />
          )}
        </div>
        {metadata.subtitle && (
          <p className="mt-0.5 truncate text-[11px] text-white/40">
            {metadata.subtitle}
          </p>
        )}
      </div>

      <span className="shrink-0 text-[11px] text-white/30 tabular-nums">
        {formatDuration(asset.duration)}
      </span>
    </Button>
  )
}
