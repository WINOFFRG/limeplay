"use client";

import {
  SpeakerHighIcon,
  SpeakerLowIcon,
  SpeakerXIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { useMediaStore } from "@/registry/default/ui/media-provider";
import { MuteControl } from "@/registry/default/ui/mute-control";

export function VolumeStateControlDemo() {
  const muted = useMediaStore((state) => state.muted);
  const volume = useMediaStore((state) => state.volume);

  return (
    <MuteControl asChild>
      <Button size="icon" variant="ghost">
        {muted || volume === 0 ? (
          <SpeakerXIcon weight="fill" />
        ) : volume < 0.5 ? (
          <SpeakerLowIcon weight="fill" />
        ) : (
          <SpeakerHighIcon weight="fill" />
        )}
      </Button>
    </MuteControl>
  );
}
