"use client";

import React, { lazy, Suspense, useEffect } from "react";

import { Media } from "@/registry/default/ui/media";
import {
  MediaProvider,
  useMediaStore
} from "@/registry/default/ui/media-provider";

import { ControlsWrapper } from "../internal/controls-wrapper";
import { ShakaProvider } from "../ui/shaka-provider";

// const ShakaProvider = lazy(() =>
//   import("@/registry/default/ui/ShakaProvider").then((mod) => ({
//     default: mod.ShakaProvider,
//   }))
// )

function PlayerRoot({ children }: React.PropsWithChildren) {
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
        <div className="min-w-xl relative mx-auto aspect-video min-h-80 w-full max-w-7xl overflow-hidden rounded-lg">
          <Media
            as="video"
            className="m-0! size-full rounded-lg bg-black object-cover"
            autoPlay={false}
            poster={"https://files.vidstack.io/sprite-fight/poster.webp"}
            muted
            loop
          />
        </div>
        <ControlsWrapper>{children}</ControlsWrapper>
      </ShakaProvider>
    </Suspense>
  );
}

export function PlayerDemoLayout({ children }: React.PropsWithChildren) {
  return (
    <MediaProvider>
      <PlayerRoot>
        <div className="flex flex-row items-center px-8 py-4">{children}</div>
      </PlayerRoot>
    </MediaProvider>
  );
}
