"use client"

import { CardsThreeIcon, PlayIcon } from "@phosphor-icons/react"
import { XIcon } from "lucide-react"
import { type ReactNode, useCallback, useMemo, useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  type AudioPlayerAsset,
  getAudioAssetMetadata,
} from "@/registry/default/blocks/audio-player/components/audio-source"
import { Button } from "@/registry/default/blocks/audio-player/components/button"
import { usePlayerStore } from "@/registry/default/hooks/use-player"
import { usePlaylistStore } from "@/registry/default/hooks/use-playlist"
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"

const PLAYLIST_SIDE_OFFSET = 24

export function Playlist() {
  const [open, setOpen] = useState(false)
  const currentItem = usePlaylistStore(
    (state) =>
      state.currentItem as null | { id: string; properties: AudioPlayerAsset }
  )
  const preloadManagers = usePlayerStore((state) => state.preloadManagers)
  const queue = usePlaylistStore(
    (state) => state.queue as { id: string; properties: AudioPlayerAsset }[]
  )
  const repeatMode = usePlaylistStore((state) => state.repeatMode)
  const shuffle = usePlaylistStore((state) => state.shuffle)
  const shuffleOrder = usePlaylistStore((state) => state.shuffleOrder)
  const skipToId = usePlaylistStore((state) => state.skipToId)

  const orderedItems = useMemo(() => {
    if (!shuffle || shuffleOrder.length === 0) {
      return queue.map((item, queueIndex) => ({ item, queueIndex }))
    }

    return shuffleOrder
      .map((queueIndex) => ({
        item: queue[queueIndex],
        queueIndex,
      }))
      .filter(
        (
          entry
        ): entry is {
          item: { id: string; properties: AudioPlayerAsset }
          queueIndex: number
        } => Boolean(entry.item)
      )
  }, [queue, shuffle, shuffleOrder])

  const displayAssets = useMemo(
    () =>
      orderedItems.map(({ item, queueIndex }) => ({
        asset: item.properties,
        id: item.id,
        queueIndex,
      })),
    [orderedItems]
  )

  const currentDisplayAsset = useMemo(() => {
    if (!currentItem) return null

    return (
      displayAssets.find(({ id }) => id === currentItem.id) ?? {
        asset: currentItem.properties,
        id: currentItem.id,
        queueIndex: queue.findIndex((item) => item.id === currentItem.id),
      }
    )
  }, [currentItem, displayAssets, queue])

  const currentDisplayIndex = useMemo(() => {
    if (!currentItem) return -1
    return displayAssets.findIndex(({ id }) => id === currentItem.id)
  }, [currentItem, displayAssets])

  const nextDisplayAssets = useMemo(() => {
    if (!currentItem) return displayAssets
    if (currentDisplayIndex === -1) return displayAssets

    if (repeatMode === "all" && displayAssets.length > 1) {
      return [
        ...displayAssets.slice(currentDisplayIndex + 1),
        ...displayAssets.slice(0, currentDisplayIndex),
      ]
    }

    return displayAssets.slice(currentDisplayIndex + 1)
  }, [currentDisplayIndex, currentItem, displayAssets, repeatMode])

  const playlistName = useMemo(
    () => getPlaylistName(currentItem?.properties, queue),
    [currentItem, queue]
  )

  const handleAssetSelect = useCallback(
    (assetId: string) => {
      skipToId(assetId)
    },
    [skipToId]
  )

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <Button aria-label="Open Playlist" asChild>
        <DropdownMenuTrigger>
          <CardsThreeIcon weight="fill" />
        </DropdownMenuTrigger>
      </Button>

      <DropdownMenuContent
        align="end"
        alignOffset={-8}
        className="dark w-92 rounded-xl border border-border bg-popover p-0 shadow-xl ring-0 shadow-black/25"
        side="top"
        sideOffset={PLAYLIST_SIDE_OFFSET}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-5">
          <h2 className="text-lg leading-none font-semibold tracking-normal text-foreground">
            Queue
          </h2>
          <Button
            aria-label="Close playlist"
            className="
              size-8 text-muted-foreground
              hover:bg-muted hover:text-foreground
              focus-visible:outline-offset-0
              [&_svg]:size-5
            "
            onClick={() => setOpen(false)}
          >
            <XIcon strokeWidth={2} />
          </Button>
        </div>

        <div
          className={`relative max-h-100 scrollbar-none overflow-y-auto overscroll-contain px-4 pb-4`}
        >
          {displayAssets.length === 0 && (
            <div className="py-14 text-center text-[13px] text-muted-foreground">
              Queue is empty
            </div>
          )}

          {displayAssets.length > 0 && (
            <div className="space-y-4">
              {currentDisplayAsset && (
                <section aria-labelledby="audio-playlist-now-playing">
                  <SectionHeading id="audio-playlist-now-playing">
                    Now playing
                  </SectionHeading>
                  <TrackRow
                    asset={currentDisplayAsset.asset}
                    index={0}
                    isActive
                    key={currentDisplayAsset.id}
                    onSelect={() => handleAssetSelect(currentDisplayAsset.id)}
                    preloaded={preloadManagers.has(currentDisplayAsset.id)}
                    setSize={1}
                    showArtworkOverlay={false}
                  />
                </section>
              )}

              <section aria-labelledby="audio-playlist-next-from">
                <SectionHeading id="audio-playlist-next-from">
                  Next From: {playlistName}
                </SectionHeading>
                {nextDisplayAssets.length === 0 ? (
                  <div className="rounded-lg px-3 py-6 text-center text-[13px] text-muted-foreground">
                    Nothing queued next
                  </div>
                ) : (
                  <div className="space-y-1">
                    {nextDisplayAssets.map(({ asset, id }, index) => (
                      <TrackRow
                        asset={asset}
                        index={index}
                        isActive={currentItem?.id === id}
                        key={id}
                        onSelect={() => handleAssetSelect(id)}
                        preloaded={preloadManagers.has(id)}
                        setSize={nextDisplayAssets.length}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function firstNonEmpty(
  ...values: (null | number | string | undefined)[]
): string | undefined {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value)
    }

    if (typeof value !== "string") continue

    const trimmed = value.trim()
    if (trimmed) return trimmed
  }

  return undefined
}

function formatDuration(ms?: number) {
  if (typeof ms !== "number" || !Number.isFinite(ms)) return "--:--"

  const secs = Math.floor(ms / 1000)
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

function getAssetPlaylistName(
  asset: AudioPlayerAsset | null | undefined
): string | undefined {
  if (!asset) return undefined

  const assetWithPlaylist = asset as AudioPlayerAsset & {
    collectionName?: string
    playlistName?: string
    playlistTitle?: string
    sourceName?: string
  }

  return firstNonEmpty(
    assetWithPlaylist.playlistName,
    assetWithPlaylist.playlistTitle,
    assetWithPlaylist.collectionName,
    assetWithPlaylist.sourceName,
    asset.group
  )
}

function getPlaylistName(
  currentAsset: AudioPlayerAsset | null | undefined,
  queue: { id: string; properties: AudioPlayerAsset }[]
) {
  return (
    getAssetPlaylistName(currentAsset) ??
    queue.map((item) => getAssetPlaylistName(item.properties)).find(Boolean) ??
    "Queue"
  )
}

function SectionHeading({ children, id }: { children: ReactNode; id: string }) {
  return (
    <h3
      className="px-0 pb-2 text-[15px] leading-none font-semibold tracking-normal text-foreground"
      id={id}
    >
      {children}
    </h3>
  )
}

function TrackRow({
  asset,
  index,
  isActive,
  onSelect,
  preloaded,
  setSize,
  showArtworkOverlay = true,
}: {
  asset: AudioPlayerAsset
  index: number
  isActive: boolean
  onSelect: () => void
  preloaded: boolean
  setSize: number
  showArtworkOverlay?: boolean
}) {
  const metadata = getAudioAssetMetadata(asset, "Untitled track")

  return (
    <Button
      aria-posinset={index + 1}
      aria-setsize={setSize}
      className={cn(
        `
          group/track h-auto w-full cursor-pointer justify-start gap-3 rounded-lg bg-transparent px-3 py-2.5 text-left transition-[background-color]
          duration-150 ease-out
          hover:bg-muted
          focus-visible:outline-offset-0
        `,
        isActive
          ? `
            bg-accent/70
            hover:bg-accent/70
          `
          : ""
      )}
      data-active={isActive ? "true" : undefined}
      onClick={onSelect}
    >
      <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted outline-1 -outline-offset-1 outline-white/10">
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
            className="absolute inset-0 flex items-center justify-center text-muted-foreground"
          >
            <LimeplayLogo className="size-5" />
          </div>
        )}
        {showArtworkOverlay && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-[background-color] duration-150 ease-out",
              isActive
                ? "bg-black/50"
                : `
                  bg-black/0
                  group-hover/track:bg-black/45
                `
            )}
          >
            <PlayIcon
              className={cn(
                "size-4 text-white drop-shadow-sm transition-[opacity,transform] duration-150 ease-out",
                isActive
                  ? "scale-100 opacity-100"
                  : `
                    scale-50 opacity-0
                    group-hover/track:scale-100 group-hover/track:opacity-100
                  `
              )}
              weight="fill"
            />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "truncate text-[13px] leading-snug transition-[color] duration-150 ease-out",
              isActive
                ? "font-medium text-foreground"
                : `
                  text-foreground/75
                  group-hover/track:text-foreground
                `
            )}
          >
            {metadata.title}
          </p>
          {preloaded && !isActive && (
            <span
              aria-label="Preloaded"
              className="size-1.5 shrink-0 rounded-full bg-foreground/35"
            />
          )}
        </div>
        {metadata.subtitle && (
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {metadata.subtitle}
          </p>
        )}
      </div>

      <span className="ml-auto shrink-0 pl-2 text-[11px] text-muted-foreground tabular-nums">
        {formatDuration(asset.duration)}
      </span>
    </Button>
  )
}
