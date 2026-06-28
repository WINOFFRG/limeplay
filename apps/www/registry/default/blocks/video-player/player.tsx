"use client"

import React from "react"

import type { PlaybackSourceControllerProps } from "@/registry/default/hooks/use-playback-source"

import { cn } from "@/lib/utils"
import { BottomControls } from "@/registry/default/blocks/video-player/components/bottom-controls"
import { PlayerErrorScreen } from "@/registry/default/blocks/video-player/components/player-error-screen"
import {
  PlayerRootContainer,
  type PlayerRootContainerLayout,
} from "@/registry/default/blocks/video-player/components/player-root-container"
import { TopOverlayContainer } from "@/registry/default/blocks/video-player/components/top-overlay-container"
import { MediaProvider } from "@/registry/default/blocks/video-player/lib/media-kit"
import { type TAsset, useAsset } from "@/registry/default/hooks/use-asset"
import { PlaybackSourceController } from "@/registry/default/hooks/use-playback-source"
import { CaptionsContainer } from "@/registry/default/ui/captions"
import { FallbackPoster } from "@/registry/default/ui/fallback-poster"
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"
import { Media } from "@/registry/default/ui/media"
import * as Layout from "@/registry/default/ui/player-layout"

import "./styles.css"

export interface VideoPlayerAsset extends TAsset {
  description?: string
  poster?: string
  title?: string
  year?: string
}

export interface VideoPlayerProps extends PlaybackSourceControllerProps<VideoPlayerAsset> {
  children?: React.ReactNode
  className?: string
  debug?: boolean
  /**
   * Controls how the player frame gets its size.
   *
   * `aspect` keeps the default 16:9 box. `fill` lets a height-constrained
   * parent own the player size.
   *
   * @default "aspect"
   */
  layout?: PlayerRootContainerLayout
  /**
   * Props to pass to the underlying video element.
   */
  mediaProps?: Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "as" | "src">
  /**
   * @default dark
   */
  theme?: "dark" | "light"
}

export const VideoPlayer = React.forwardRef<HTMLDivElement, VideoPlayerProps>(
  function VideoPlayer(
    {
      autoLoad,
      children,
      className,
      debug,
      initialIndex,
      layout = "aspect",
      loading,
      mediaProps,
      source,
      sourceKey,
      theme = "dark",
    },
    ref
  ) {
    return (
      <MediaProvider debug={debug}>
        <PlayerRootContainer
          className={cn(className, theme === "dark" && "dark")}
          layout={layout}
          ref={ref}
        >
          <PlaybackSourceController
            autoLoad={autoLoad}
            initialIndex={initialIndex}
            loading={loading}
            source={source}
            sourceKey={sourceKey}
          />
          <PlayerErrorScreen
            initialIndex={initialIndex}
            loading={loading}
            source={source}
            sourceKey={sourceKey}
          />
          <Layout.PlayerContainer className="size-full min-h-0">
            <FallbackPoster>
              <LimeplayLogo />
            </FallbackPoster>
            <CurrentAssetMedia {...(mediaProps ?? {})} />
            {children}
            <Layout.ControlsOverlayContainer
              className="
                bg-lp-controls-fade-top bg-size-[100%_80%] bg-top bg-no-repeat transition-opacity duration-300 ease-out
                group-data-[idle=true]/root:opacity-0
                group-data-[status=buffering]/root:opacity-100
                group-data-[status=error]/root:opacity-100
                group-data-[status=paused]/root:opacity-100
              "
            />
            <Layout.ControlsOverlayContainer
              className="
                bg-lp-controls-fade-bottom bg-size-[100%_45%] bg-bottom bg-no-repeat transition-opacity duration-300 ease-out
                group-data-[idle=true]/root:opacity-0
                group-data-[status=buffering]/root:opacity-100
                group-data-[status=error]/root:opacity-100
                group-data-[status=paused]/root:opacity-100
              "
            />
            <Layout.ControlsContainer
              className={`
                mx-auto w-full
                @3xl/root:max-w-6xl
                @5xl/root:max-w-[1728px]
              `}
            >
              <TopOverlayContainer
                className="
                  px-[5%] pt-[clamp(0.75rem,7svh,2.5rem)] transition-all duration-300 ease-out-quad
                  group-data-[idle=false]/root:translate-y-0 group-data-[idle=false]/root:opacity-100
                  group-data-[idle=true]/root:-translate-y-4 group-data-[idle=true]/root:opacity-0
                  group-data-[status=buffering]/root:translate-y-0 group-data-[status=buffering]/root:opacity-100
                  group-data-[status=error]/root:translate-y-0 group-data-[status=error]/root:opacity-100
                  group-data-[status=paused]/root:translate-y-0 group-data-[status=paused]/root:opacity-100
                  @3xl/root:px-[min(80px,10%)]
                "
              />
              <CaptionsContainer
                className="
                  px-[5%] pb-[clamp(0.5rem,4svh,1.5rem)]
                  @3xl/root:px-[min(80px,10%)]
                "
              />
              <BottomControls
                className="
                  px-[5%] pb-[clamp(0.75rem,7svh,2.5rem)] transition-all duration-300 ease-out-quad
                  group-data-[idle=false]/root:translate-y-0 group-data-[idle=false]/root:opacity-100
                  group-data-[idle=true]/root:translate-y-4 group-data-[idle=true]/root:opacity-0
                  group-data-[status=buffering]/root:translate-y-0 group-data-[status=buffering]/root:opacity-100
                  group-data-[status=error]/root:translate-y-0 group-data-[status=error]/root:opacity-100
                  group-data-[status=paused]/root:translate-y-0 group-data-[status=paused]/root:opacity-100
                  @3xl/root:px-[min(80px,10%)]
                "
              />
            </Layout.ControlsContainer>
          </Layout.PlayerContainer>
        </PlayerRootContainer>
      </MediaProvider>
    )
  }
)

VideoPlayer.displayName = "VideoPlayer"

function CurrentAssetMedia({
  className,
  poster,
  ...mediaProps
}: NonNullable<VideoPlayerProps["mediaProps"]>) {
  const { currentItem } = useAsset<VideoPlayerAsset>()
  const currentPoster = currentItem?.properties.poster

  return (
    <Media
      {...(mediaProps as React.ComponentPropsWithoutRef<typeof Media>)}
      as="video"
      className={cn("size-full object-contain", className)}
      poster={poster ?? currentPoster}
    />
  )
}
