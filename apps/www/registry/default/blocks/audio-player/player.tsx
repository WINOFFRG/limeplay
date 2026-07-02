"use client"

import React from "react"

import type { TAsset } from "@/registry/default/hooks/use-asset"
import type { PlaybackSourceControllerProps } from "@/registry/default/hooks/use-playback-source"

import { cn } from "@/lib/utils"
import { AudioSourceProvider } from "@/registry/default/blocks/audio-player/components/audio-source"
import { PlayerControls } from "@/registry/default/blocks/audio-player/components/controls"
import { TimelineControl } from "@/registry/default/blocks/audio-player/components/fixed-timeline-control"
import { MediaProvider } from "@/registry/default/blocks/audio-player/lib/media-kit"
import { Media } from "@/registry/default/ui/media"
import { RootContainer } from "@/registry/default/ui/root-container"

import "./styles.css"

export interface AudioPlayerAsset extends TAsset {
  albumName?: string
  artistName?: string
  artwork?: {
    templateUrl?: string
    url?: string
  }
  description?: string
  duration?: number
  features?: string[]
  genre?: string
  group?: string
  images?: {
    backdrop?: string
    poster?: string
  }
  name?: string
  playbackUrls?: PlaybackUrls
  poster?: string
  releaseYear?: number | string
  subtitle?: string
  title?: string
  year?: number | string
}

export interface AudioPlayerProps extends PlaybackSourceControllerProps<AudioPlayerAsset> {
  children?: React.ReactNode
  className?: string
  debug?: boolean
  /**
   * Props to pass to the underlying audio element.
   */
  mediaProps?: Omit<React.AudioHTMLAttributes<HTMLAudioElement>, "as" | "src">
  /**
   * @default dark
   */
  theme?: "dark" | "light"
}

export interface PlaybackUrls {
  primary: string
  secondary?: string
}

export const AudioPlayer = React.forwardRef<HTMLDivElement, AudioPlayerProps>(
  function AudioPlayer(
    {
      autoLoad,
      children,
      className,
      debug,
      initialIndex,
      loading,
      mediaProps,
      source,
      sourceKey,
      theme = "dark",
    },
    ref
  ) {
    const { className: mediaClassName, ...safeMediaProps } = mediaProps ?? {}

    return (
      <MediaProvider debug={debug}>
        <AudioSourceProvider
          autoLoad={autoLoad}
          initialIndex={initialIndex}
          loading={loading}
          source={source}
          sourceKey={sourceKey}
        >
          <RootContainer
            aria-label="Audio player"
            aspectRatio={false}
            className={cn(
              "limeplay relative z-50 h-18 w-full border-t border-border bg-background",
              theme === "dark" && "dark",
              theme === "light" && "light",
              className
            )}
            ref={ref}
          >
            <Media
              {...(safeMediaProps as React.ComponentPropsWithoutRef<
                typeof Media
              >)}
              as="audio"
              className={mediaClassName}
            />
            <TimelineControl />
            <PlayerControls />
          </RootContainer>
          {children}
        </AudioSourceProvider>
      </MediaProvider>
    )
  }
)

AudioPlayer.displayName = "AudioPlayer"
