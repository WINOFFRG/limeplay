"use client"

import { RotateCwIcon } from "lucide-react"
import React from "react"

import type {
  Asset,
  PlayerSource,
  UseAssetOptions,
} from "@/registry/default/hooks/use-asset"

import { cn } from "@/lib/utils"
import { BottomControls } from "@/registry/default/blocks/video-player/components/bottom-controls"
import { Button } from "@/registry/default/blocks/video-player/components/button"
import { MediaProvider } from "@/registry/default/blocks/video-player/lib/media-kit"
import { useAsset } from "@/registry/default/hooks/use-asset"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"
import { PlaybackSourceController } from "@/registry/default/hooks/use-playback-source"
import { CaptionsContainer } from "@/registry/default/ui/captions"
import { ErrorScreen } from "@/registry/default/ui/error-screen"
import { FallbackPoster } from "@/registry/default/ui/fallback-poster"
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"
import { Media } from "@/registry/default/ui/media"
import * as Layout from "@/registry/default/ui/player-layout"
import { RootContainer } from "@/registry/default/ui/root-container"

export interface VideoPlayerAsset extends Asset {
  description?: string
  poster?: string
  title?: string
}

export interface VideoPlayerProps {
  autoLoad?: boolean
  children?: React.ReactNode
  className?: string
  debug?: boolean
  initialIndex?: number
  loading?: UseAssetOptions<VideoPlayerAsset>
  /**
   * Props to pass to the underlying video element.
   */
  mediaProps?: Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "as" | "src">
  source?: PlayerSource<VideoPlayerAsset>
  sourceKey?: string
}

export const VideoPlayer = React.forwardRef<HTMLDivElement, VideoPlayerProps>(
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
        <PlaybackSourceController
          autoLoad={autoLoad}
          initialIndex={initialIndex}
          loading={loading}
          source={source}
          sourceKey={sourceKey}
        />
        <RootContainer className={cn("m-auto w-full", className)} ref={ref}>
          <Layout.PlayerContainer>
            <PlayerErrorScreen />
            <FallbackPoster>
              <LimeplayLogo />
            </FallbackPoster>
            <Media
              {...(safeMediaProps as React.ComponentPropsWithoutRef<
                typeof Media
              >)}
              as="video"
              className={cn("size-full object-cover", mediaClassName)}
            />
            {children}
            <Layout.ControlsOverlayContainer />
            <Layout.ControlsContainer className="pb-6">
              <CaptionsContainer />
              <BottomControls />
            </Layout.ControlsContainer>
          </Layout.PlayerContainer>
        </RootContainer>
      </MediaProvider>
    )
  }
)

VideoPlayer.displayName = "VideoPlayer"

function PlayerErrorScreen() {
  const error = usePlaybackStore((s) => s.error)
  const status = usePlaybackStore((s) => s.status)
  const { currentItem, loadAsset } = useAsset<VideoPlayerAsset>()

  const retryStream = React.useCallback(() => {
    if (!currentItem) return
    void loadAsset(currentItem.properties)
  }, [currentItem, loadAsset])

  if (status !== "error") return null

  return (
    <ErrorScreen className="rounded-lg" error={error}>
      <Button onClick={retryStream} size="sm">
        <RotateCwIcon />
        Retry
      </Button>
    </ErrorScreen>
  )
}
