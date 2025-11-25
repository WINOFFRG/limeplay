"use client";

import { ClosedCaptioningIcon } from "@phosphor-icons/react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { MediaReadyState } from "@/registry/default/hooks/use-player";
import {
  CaptionsContainer,
  CaptionsControl,
} from "@/registry/default/ui/captions";
import { useMediaStore } from "@/registry/default/ui/media-provider";

export function CaptionsStateControlDemo() {
  const textTrackVisible = useMediaStore((state) => state.textTrackVisible);
  const player = useMediaStore((state) => state.player);
  const readyState = useMediaStore((state) => state.readyState);

  // DEV: Adding text tracks externally as demo asset doesn't have built-in text tracks
  useEffect(() => {
    if (!player || readyState < MediaReadyState.HAVE_METADATA) {
      return;
    }

    player
      .addTextTrackAsync(
        "/assets/sprite_fight.vtt",
        "en",
        "captions",
        "text/vtt",
        undefined,
        "English"
      )
      .then(() => {
        player.selectTextTrack(player.getTextTracks()[0]);
        player.setTextTrackVisibility(true);
        console.log("Text track added");
      })
      .catch((error: unknown) => {
        console.error("Error adding text track:", error);
      });
  }, [readyState, player]);

  return (
    <CaptionsControl asChild>
      <Button size="icon" variant="ghost">
        <ClosedCaptioningIcon
          size={18}
          weight={textTrackVisible ? "fill" : "regular"}
        />
      </Button>
    </CaptionsControl>
  );
}

export function CaptionsHybridDemo() {
  return <CaptionsContainer className="mb-16" />;
}
