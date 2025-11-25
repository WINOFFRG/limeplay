import React from "react";

import { cn } from "@/lib/utils";
import { MediaElement } from "@/registry/default/blocks/basic-player/components/media-element";
import { PlaybackStateControl } from "@/registry/default/blocks/basic-player/components/playback-state-control";
import { PlayerHooks } from "@/registry/default/blocks/basic-player/components/player-hooks";
import { FallbackPoster } from "@/registry/default/ui/fallback-poster";
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo";
import { MediaProvider } from "@/registry/default/ui/media-provider";
import * as Layout from "@/registry/default/ui/player-layout";
import { RootContainer } from "@/registry/default/ui/root-container";

export interface BasicMediaPlayerProps
  extends React.ComponentPropsWithoutRef<"div"> {
  src: string;
  debug?: boolean;
  className?: string;
}

export const LimeplayMediaPlayer = React.forwardRef<
  HTMLDivElement,
  BasicMediaPlayerProps
>((props, ref) => {
  const { className, src, ...etc } = props;

  return (
    <MediaProvider>
      <RootContainer
        className={cn("m-auto w-full md:min-w-80", className)}
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
  );
});

LimeplayMediaPlayer.displayName = "LimeplayMediaPlayer";
