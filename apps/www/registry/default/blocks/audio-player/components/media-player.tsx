"use client"

import type {
  AudioHTMLAttributes,
  ComponentPropsWithoutRef,
  ReactNode,
} from "react"

import React from "react"

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
import { RootContainer } from "@/registry/default/ui/root-container"

import styles from "../audio-player.module.css"

export type { AudioPlayerAsset, PlaybackUrls }

export interface AudioPlayerProps {
  autoLoad?: boolean
  children?: ReactNode
  className?: string
  debug?: boolean
  initialIndex?: number
  loading?: AudioSourceProviderProps["loading"]
  /**
   * Props to pass to the underlying audio element.
   */
  mediaProps?: Omit<AudioHTMLAttributes<HTMLAudioElement>, "as" | "src">
  source?: AudioSourceProviderProps["source"]
  sourceKey?: string
}

export const AudioPlayer = React.forwardRef<HTMLDivElement, AudioPlayerProps>(
  (
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
    },
    ref
  ) => {
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
              styles.dark,
              "relative z-50 h-18 w-full border-t border-border bg-background",
              className
            )}
            ref={ref}
          >
            <Media
              {...(safeMediaProps as ComponentPropsWithoutRef<typeof Media>)}
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
