"use client";

import { Media } from "@/registry/default/ui/media";
import {
  MediaProvider,
  useMediaStore
} from "@/registry/default/ui/media-provider";
import React, { useEffect } from "react";
import { BottomControls } from "@/components/player/bottom-controls";
import * as Layout from "@/registry/default/ui/player-layout";
import { CustomPlayerWrapper } from "@/components/player/custom-player-wrapper";

import { PlayerHooks } from "@/registry/default/ui/player-hooks";

function MediaElement() {
  const player = useMediaStore((state) => state.player);
  const mediaRef = useMediaStore((state) => state.mediaRef);

  useEffect(() => {
    const mediaElement = mediaRef?.current;

    if (player && mediaElement) {
      player.load(
        "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8"
      );

      return () => {
        if (mediaElement) {
          mediaElement.pause();
        }

        if (player) {
          player.destroy();
        }
      };
    }
  }, [player, mediaRef]);

  return (
    <Media
      as="video"
      className="size-full bg-black object-cover"
      autoPlay={false}
      poster={"https://files.vidstack.io/sprite-fight/poster.webp"}
      muted
      controls={false}
      loop
    />
  );
}

export function MediaPlayer() {
  return (
    <CustomPlayerWrapper>
      <MediaProvider>
        <PlayerHooks />
        <Layout.RootContainer height={720} width={1280} className="container">
          <Layout.PlayerContainer className="mx-auto my-16">
            <MediaElement />
            <Layout.ControlsContainer>
              <BottomControls />
            </Layout.ControlsContainer>
          </Layout.PlayerContainer>
        </Layout.RootContainer>
      </MediaProvider>
    </CustomPlayerWrapper>
  );
}
