import React from "react"

import { cn } from "@/lib/utils"
import { MediaElement } from "@/registry/default/blocks/basic-player/components/media-element"
import { MediaProvider } from "@/registry/default/blocks/basic-player/lib/media"
import { PlaybackStateControl } from "@/registry/default/blocks/basic-player/components/playback-state-control"
import { FallbackPoster } from "@/registry/default/ui/fallback-poster"
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"
import * as Layout from "@/registry/default/ui/player-layout"
import { RootContainer } from "@/registry/default/ui/root-container"

export interface BasicMediaPlayerProps
  extends React.ComponentPropsWithoutRef<"div"> {
  className?: string
  debug?: boolean
  src: string
}

export const LimeplayMediaPlayer = React.forwardRef<
  HTMLDivElement,
  BasicMediaPlayerProps
>((props, ref) => {
  const { className, src, ...etc } = props

  return (
    <MediaProvider>
      <RootContainer
        className={cn(
          `
            m-auto w-full
            md:min-w-80
          `,
          className
        )}
        height={720}
        ref={ref}
        width={1280}
        {...etc}
      >
        <Layout.PlayerContainer>
          <FallbackPoster className="bg-black">
            <LimeplayLogo />
          </FallbackPoster>
          <MediaElement src={src} />
          <Layout.ControlsOverlayContainer />
          <Layout.ControlsContainer>
            <Layout.ControlsBottomContainer>
              <PlaybackStateControl />
            </Layout.ControlsBottomContainer>
          </Layout.ControlsContainer>
        </Layout.PlayerContainer>
      </RootContainer>
    </MediaProvider>
  )
})

LimeplayMediaPlayer.displayName = "LimeplayMediaPlayer"
