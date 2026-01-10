import React from "react"

import { cn } from "@/lib/utils"
import { BottomControls } from "@/registry/default/blocks/linear-player/components/bottom-controls"
import { PlayerHooks } from "@/registry/default/blocks/linear-player/components/player-hooks"
import { CaptionsContainer } from "@/registry/default/ui/captions"
import { FallbackPoster } from "@/registry/default/ui/fallback-poster"
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"
import { Media } from "@/registry/default/ui/media"
import { MediaProvider } from "@/registry/default/ui/media-provider"
import * as Layout from "@/registry/default/ui/player-layout"
import { RootContainer } from "@/registry/default/ui/root-container"

export interface LinearMediaPlayerProps {
  className?: string
  debug?: boolean
}

export const LinearMediaPlayer = React.forwardRef<
  HTMLDivElement,
  LinearMediaPlayerProps
>(({ className, debug = false }, ref) => {
  return (
    <MediaProvider debug={debug}>
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
      >
        <Layout.PlayerContainer>
          <FallbackPoster className="bg-black">
            <LimeplayLogo />
          </FallbackPoster>
          <Media
            as="video"
            autoPlay={false}
            className="size-full object-cover"
            muted
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
