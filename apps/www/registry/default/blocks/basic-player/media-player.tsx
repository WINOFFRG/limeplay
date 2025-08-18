import React from "react"

import { cn } from "@/lib/utils"
import { MediaElement } from "@/registry/default/blocks/basic-player/components/media-element"
import { PlaybackStateControl } from "@/registry/default/blocks/basic-player/components/playback-state-control"
import { PlayerHooks } from "@/registry/default/blocks/basic-player/components/player-hooks"
import { FallbackPoster } from "@/registry/default/ui/fallback-poster"
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"
import { MediaProvider } from "@/registry/default/ui/media-provider"
import * as Layout from "@/registry/default/ui/player-layout"
import { RootContainer } from "@/registry/default/ui/root-container"

export interface BasicMediaPlayerProps
  extends React.ComponentPropsWithoutRef<"div"> {
  src?: string
  debug?: boolean
  className?: string
}

const DEFAULT_SRC =
  "https://ad391cc0d55b44c6a86d232548adc225.mediatailor.us-east-1.amazonaws.com/v1/master/d02fedbbc5a68596164208dd24e9b48aa60dadc7/singssai/master.m3u8"

export const LimeplayMediaPlayer = React.forwardRef<
  HTMLDivElement,
  BasicMediaPlayerProps
>((props, ref) => {
  const { className, src = DEFAULT_SRC, ...etc } = props

  return (
    <MediaProvider>
      <RootContainer
        ref={ref}
        height={720}
        width={1280}
        className={cn("m-auto w-full md:min-w-80", className)}
        {...etc}
      >
        <Layout.PlayerContainer>
          <FallbackPoster className="bg-black">
            <LimeplayLogo />
          </FallbackPoster>
          <MediaElement src={src} />
          <PlayerHooks />
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
