"use client"

import type {
  AudioHTMLAttributes,
  ComponentPropsWithoutRef,
  ReactNode,
} from "react"

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
  autoPlay?: boolean
  children?: ReactNode
  className?: string
  debug?: boolean
  getAssetId?: AudioSourceProviderProps["getAssetId"]
  initialIndex?: number
  /**
   * Props to pass to the underlying audio element.
   */
  mediaProps?: Omit<
    AudioHTMLAttributes<HTMLAudioElement>,
    "as" | "autoPlay" | "className"
  >
  playlist?: AudioPlayerAsset[]
  resolveSource?: AudioSourceProviderProps["resolveSource"]
}

export function AudioPlayer({
  asset,
  assetOptions,
  autoLoad,
  autoPlay = false,
  children,
  className,
  debug,
  getAssetId,
  initialIndex,
  mediaProps,
  playlist,
  resolveSource,
}: AudioPlayerProps = {}) {
  const { src: mediaSrc, ...safeMediaProps } = mediaProps ?? {}

  return (
    <MediaProvider debug={debug}>
      <AudioSourceProvider
        asset={asset}
        assetOptions={assetOptions}
        autoLoad={autoLoad}
        getAssetId={getAssetId}
        initialIndex={initialIndex}
        mediaSrc={typeof mediaSrc === "string" ? mediaSrc : undefined}
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
          <Media
            {...(safeMediaProps as ComponentPropsWithoutRef<typeof Media>)}
            as="audio"
            autoPlay={autoPlay}
          />
          <TimelineControl />
          <PlayerControls />
        </div>
        {children}
      </AudioSourceProvider>
    </MediaProvider>
  )
}
