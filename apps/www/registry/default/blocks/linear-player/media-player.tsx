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
}

export function LinearMediaPlayer({
  src,
  debug = false,
}: LinearMediaPlayerProps) {
  return (
    <MediaProvider debug={debug}>
      <Layout.RootContainer
        height={720}
        width={1280}
        className="m-auto max-w-[var(--width,1280px)] min-w-80 rounded-xl border-3 border-white/60 p-0.5"
      >
        <Layout.PlayerContainer>
          <FallbackPoster className="bg-primary-foreground">
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
