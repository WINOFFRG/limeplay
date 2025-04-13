"use client";

import { Media } from "@/registry/default/ui/media";
import {
  MediaProvider,
  useMediaStore
} from "@/registry/default/ui/media-provider";
import React, { Suspense, useEffect } from "react";
import { ShakaProvider } from "@/registry/default/ui/shaka-provider";
import { PlayerContainer } from "./player-container";
import { ControlsContainer } from "./controls-container";

function PlayerRoot() {
  const player = useMediaStore((state) => state.player);
  const mediaRef = useMediaStore((state) => state.mediaRef);

  useEffect(() => {
    if (player) {
      player.load(
        "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8"
      );

      return () => {
        if (mediaRef.current) {
          mediaRef.current.pause();
        }

        player.destroy();
      };
    }
  }, [player]);

  return (
    <Suspense>
      <ShakaProvider>
        <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-lg">
          <Media
            as="video"
            className="size-full rounded-lg bg-black object-cover"
            autoPlay={false}
            poster={"https://files.vidstack.io/sprite-fight/poster.webp"}
            muted
            loop
          />
        </div>
        <ControlsContainer />
      </ShakaProvider>
    </Suspense>
  );
}

export function PlayerDemoLayout() {
  return (
    <MediaProvider>
      <PlayerContainer>
        <PlayerRoot />
      </PlayerContainer>
    </MediaProvider>
  );
}
