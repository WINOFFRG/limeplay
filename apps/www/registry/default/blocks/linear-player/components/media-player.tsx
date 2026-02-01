import React from "react"

import type { Asset } from "@/registry/default/hooks/use-asset"

import { cn } from "@/lib/utils"
import { BottomControls } from "@/registry/default/blocks/linear-player/components/bottom-controls"
import { PlayerHooks } from "@/registry/default/blocks/linear-player/components/player-hooks"
import { CaptionsContainer } from "@/registry/default/ui/captions"
import { FallbackPoster } from "@/registry/default/ui/fallback-poster"
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"
import { Media, type MediaProps } from "@/registry/default/ui/media"
import { MediaProvider } from "@/registry/default/ui/media-provider"
import * as Layout from "@/registry/default/ui/player-layout"
import { RootContainer } from "@/registry/default/ui/root-container"

export interface LinearMediaPlayerProps<
  T extends MediaType = "audio" | "video",
> {
  /**
   * The type of media element to render
   * @default "video"
   */
  as?: T
  asset?: Asset
  className?: string
  debug?: boolean
  /**
   * Props to pass to the underlying media element (video/audio)
   */
  mediaProps?: MediaPropsForType<T>
  /**
   * Ref to the underlying media element
   */
  mediaRef?: React.Ref<MediaElementType<T>>
}

type MediaElementType<T extends MediaType> = T extends "audio"
  ? HTMLAudioElement
  : HTMLVideoElement

type MediaPropsForType<T extends MediaType> = T extends "audio"
  ? Omit<React.AudioHTMLAttributes<HTMLAudioElement>, "as" | "className">
  : Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "as" | "className">

type MediaType = MediaProps["as"]

export const LinearMediaPlayer = React.forwardRef<
  HTMLDivElement,
  LinearMediaPlayerProps
>(({ as = "video", className, debug = false, mediaProps, mediaRef }, ref) => {
  return (
    <MediaProvider debug={debug}>
      <RootContainer className={cn("m-auto w-full", className)} ref={ref}>
        <Layout.PlayerContainer>
          <FallbackPoster className="bg-black">
            <LimeplayLogo />
          </FallbackPoster>
          <Media
            {...(mediaProps as React.ComponentPropsWithoutRef<typeof Media>)}
            as={as}
            className="size-full object-cover"
            ref={mediaRef as React.Ref<HTMLMediaElement>}
          />
          <PlayerHooks />
          <Layout.ControlsOverlayContainer />
          <Layout.ControlsContainer className="pb-6">
            <CaptionsContainer />
            <BottomControls />
          </Layout.ControlsContainer>
        </Layout.PlayerContainer>
      </RootContainer>
    </MediaProvider>
  )
})

LinearMediaPlayer.displayName = "LinearMediaPlayer"
