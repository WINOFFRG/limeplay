"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

import { Media } from "@/registry/default/ui/media";
import { useMediaStore } from "@/registry/default/ui/media-provider";

import { ControlsContainer } from "./ControlsContainer";
import { PlayerContainer } from "./PlayerContainer";

const ShakaProvider = dynamic(
  () =>
    import("@/registry/default/ui/shaka-provider").then(
      (mod) => mod.ShakaProvider
    ),
  {
    ssr: false
  }
);

export function VideoPlayer() {
  const player = useMediaStore((state) => state.player);

  useEffect(() => {
    if (player) {
      player.load(
        "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8"
      );
      // player.load("https://files.vidstack.io/sprite-fight/1080p.mp4")
    }
  }, [player]);

  return (
    <PlayerContainer>
      <ShakaProvider>
        <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-lg">
          <Media
            as="video"
            className="size-full rounded-lg bg-black object-cover"
            src="/video.mp4"
            autoPlay
            muted
            loop
          />
          <ControlsContainer />
        </div>
      </ShakaProvider>
    </PlayerContainer>
  );
}
