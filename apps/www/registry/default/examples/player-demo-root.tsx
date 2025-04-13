"use client";

import { Media } from "@/registry/default/ui/media";
import {
  MediaProvider,
  useMediaStore,
} from "@/registry/default/ui/media-provider";
import React, { Suspense, useEffect } from "react";
import { useControls } from "leva";

import { ControlsWrapper } from "@/registry/default/internal/controls-wrapper";
import { ShakaProvider } from "@/registry/default/ui/shaka-provider";
import { LevaControls } from "@/components/leva-controls";

function PlayerRoot({ children }: React.PropsWithChildren) {
  const player = useMediaStore((state) => state.player);

  const { streamUrl } = useControls({
    streamUrl: {
      value:
        "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8",
      label: "Stream URL",
    },
  });

  useEffect(() => {
    if (player) {
      try {
        const url = new URL(streamUrl);

        if (url.protocol === "http:" || url.protocol === "https:") {
          player.load(streamUrl);
        } else {
          console.warn("Invalid stream URL protocol. Must be http or https.");
        }
      } catch (error) {
        console.error("Invalid stream URL format:", streamUrl);
      }
    }
  }, [player, streamUrl]);

  return (
    <Suspense>
      <ShakaProvider>
        <div className="min-w-xl relative mx-auto aspect-video min-h-80 w-full max-w-7xl overflow-hidden rounded-lg">
          <Media
            as="video"
            className="m-0! size-full rounded-lg bg-black object-cover"
            poster={"https://files.vidstack.io/sprite-fight/poster.webp"}
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
      <LevaControls />
      <PlayerRoot>
        <div className="flex flex-row px-8 py-4">{children}</div>
      </PlayerRoot>
    </MediaProvider>
  );
}
