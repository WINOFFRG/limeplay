import type { ReactNode } from "react"

import type {
  AudioPlayerAsset,
  AudioSourceProviderProps,
  PlaybackUrls,
} from "@/registry/default/blocks/audio-player/components/audio-source"

import { cn } from "@/lib/utils"
import { AudioSourceProvider } from "@/registry/default/blocks/audio-player/components/audio-source"
import { PlayerControls } from "@/registry/default/blocks/audio-player/components/controls"
import { TimelineControl } from "@/registry/default/blocks/audio-player/components/fixed-timeline-control"
import { MediaProvider } from "@/registry/default/blocks/audio-player/lib/media-kit"
import { Media } from "@/registry/default/ui/media"

import styles from "../audio-player.module.css"

export type { AudioPlayerAsset, PlaybackUrls }

export interface AudioPlayerProps {
  asset?: AudioSourceProviderProps["asset"]
  assetOptions?: AudioSourceProviderProps["assetOptions"]
  autoLoad?: boolean
  children?: ReactNode
  className?: string
  debug?: boolean
  getAssetId?: AudioSourceProviderProps["getAssetId"]
  initialIndex?: number
  playlist?: AudioPlayerAsset[]
  resolveSource?: AudioSourceProviderProps["resolveSource"]
}

export function AudioPlayer({
  asset,
  assetOptions,
  autoLoad,
  children,
  className,
  debug,
  getAssetId,
  initialIndex,
  playlist,
  resolveSource,
}: AudioPlayerProps = {}) {
  return (
    <MediaProvider debug={debug}>
      <AudioSourceProvider
        asset={asset}
        assetOptions={assetOptions}
        autoLoad={autoLoad}
        getAssetId={getAssetId}
        initialIndex={initialIndex}
        playlist={playlist}
        resolveSource={resolveSource}
      >
        <div
          className={cn(
            styles.dark,
            "relative z-50 h-18 w-full border-t border-border bg-background",
            className
          )}
        >
          <Media as="audio" autoPlay />
          <TimelineControl />
          <PlayerControls />
        </div>
        {children}
      </AudioSourceProvider>
    </MediaProvider>
  )
}
