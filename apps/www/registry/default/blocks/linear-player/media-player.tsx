import { cn } from "@/lib/utils"
import { BottomControls } from "@/registry/default/blocks/linear-player/components/bottom-controls"
import { MediaElement } from "@/registry/default/blocks/linear-player/components/media-element"
import { PlayerHooks } from "@/registry/default/blocks/linear-player/components/player-hooks"
import { FallbackPoster } from "@/registry/default/ui/fallback-poster"
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"
import { MediaProvider } from "@/registry/default/ui/media-provider"
import * as Layout from "@/registry/default/ui/player-layout"

export interface LinearMediaPlayerProps {
  src: string
  debug?: boolean
  className?: string
}

export function LinearMediaPlayer({
  src,
  debug = false,
  className,
}: LinearMediaPlayerProps) {
  return (
    <MediaProvider debug={debug}>
      <Layout.RootContainer
        height={720}
        width={1280}
        // eslint-disable-next-line better-tailwindcss/no-unregistered-classes
        className={cn("dark m-auto w-full min-w-80", className)}
      >
        <Layout.PlayerContainer>
          <FallbackPoster className="bg-black">
            <LimeplayLogo />
          </FallbackPoster>
          <MediaElement src={src} />
          <PlayerHooks />
          <Layout.ControlsOverlayContainer />
          <Layout.ControlsContainer>
            <BottomControls />
          </Layout.ControlsContainer>
        </Layout.PlayerContainer>
      </Layout.RootContainer>
    </MediaProvider>
  )
}
