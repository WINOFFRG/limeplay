import React from "react"

import type {
  Asset,
  GetAssetId,
  ResolveSource,
  UseAssetOptions,
} from "@/registry/default/hooks/use-asset"

import { cn } from "@/lib/utils"
import { BottomControls } from "@/registry/default/blocks/video-player/components/bottom-controls"
import { MediaProvider } from "@/registry/default/blocks/video-player/lib/media-kit"
import { PlaybackSourceController } from "@/registry/default/hooks/use-playback-source"
import { CaptionsContainer } from "@/registry/default/ui/captions"
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
  asset?: VideoPlayerAsset
  assetOptions?: Omit<
    UseAssetOptions<VideoPlayerAsset>,
    "getAssetId" | "resolveSource"
  >
  children?: React.ReactNode
  className?: string
  debug?: boolean
  getAssetId?: GetAssetId<VideoPlayerAsset>
  initialIndex?: number
  /**
   * Props to pass to the underlying video element.
   */
  mediaProps?: Omit<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    "as" | "className"
  >
  /**
   * Ref to the underlying video element.
   */
  mediaRef?: React.Ref<HTMLVideoElement>
  playlist?: VideoPlayerAsset[]
  resolveSource?: ResolveSource<VideoPlayerAsset>
}

export const VideoPlayer = React.forwardRef<HTMLDivElement, VideoPlayerProps>(
  (
    {
      asset,
      assetOptions,
      children,
      className,
      debug,
      getAssetId,
      initialIndex,
      mediaProps,
      mediaRef,
      playlist,
      resolveSource,
    },
    ref
  ) => {
    const { src: mediaSrc, ...safeMediaProps } = mediaProps ?? {}

    return (
      <MediaProvider debug={debug}>
        <PlaybackSourceController
          asset={asset}
          assetOptions={assetOptions}
          getAssetId={getAssetId}
          initialIndex={initialIndex}
          mediaSrc={typeof mediaSrc === "string" ? mediaSrc : undefined}
          playlist={playlist}
          resolveSource={resolveSource}
        />
        <RootContainer className={cn("m-auto w-full", className)} ref={ref}>
          <Layout.PlayerContainer>
            <FallbackPoster>
              <LimeplayLogo />
            </FallbackPoster>
            <Media
              {...(safeMediaProps as React.ComponentPropsWithoutRef<
                typeof Media
              >)}
              as="video"
              className="size-full object-cover"
              ref={mediaRef as React.Ref<HTMLMediaElement>}
            />
            <Layout.ControlsOverlayContainer />
            <Layout.ControlsContainer className="pb-6">
              <CaptionsContainer />
              <BottomControls />
            </Layout.ControlsContainer>
          </Layout.PlayerContainer>
        </RootContainer>
        {children}
      </MediaProvider>
    )
  }
)

VideoPlayer.displayName = "VideoPlayer"
