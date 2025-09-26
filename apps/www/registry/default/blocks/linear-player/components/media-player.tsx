import React from "react"

import { cn } from "@/lib/utils"
import { BottomControls } from "@/registry/default/blocks/linear-player/components/bottom-controls"
import { MediaElement } from "@/registry/default/blocks/linear-player/components/media-element"
import { PlayerHooks } from "@/registry/default/blocks/linear-player/components/player-hooks"
import { CaptionsContainer } from "@/registry/default/ui/captions"
import { FallbackPoster } from "@/registry/default/ui/fallback-poster"
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"
import { MediaProvider } from "@/registry/default/ui/media-provider"
import * as Layout from "@/registry/default/ui/player-layout"
import { RootContainer } from "@/registry/default/ui/root-container"

export interface LinearMediaPlayerProps {
  src?: string
  debug?: boolean
  className?: string
}

export const LinearMediaPlayer = React.forwardRef<
  HTMLDivElement,
  LinearMediaPlayerProps
>(({ debug = false, className }, ref) => {
  return (
    <MediaProvider debug={debug}>
      <RootContainer
        ref={ref}
        height={720}
        width={1280}
        className={cn(
          `
            m-auto w-full
            md:min-w-80
          `,
          className
        )}
      >
        <Layout.PlayerContainer>
          <FallbackPoster className="bg-black">
            <LimeplayLogo />
          </FallbackPoster>
          <MediaElement />
          <PlayerHooks />
          <Layout.ControlsOverlayContainer />
          <Layout.ControlsContainer>
            <CaptionsContainer />
            <BottomControls />
          </Layout.ControlsContainer>
        </Layout.PlayerContainer>
      </RootContainer>
    </MediaProvider>
  )
})

LinearMediaPlayer.displayName = "LinearMediaPlayer"
