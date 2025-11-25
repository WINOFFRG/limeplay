import {
  CircleNotchIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { useMediaStore } from "@/registry/default/ui/media-provider";
import { PlaybackControl } from "@/registry/default/ui/playback-control";

export function PlaybackStateControlDemo() {
  const status = useMediaStore((state) => state.status);

  return (
    <PlaybackControl asChild>
      <Button size="icon" variant="ghost">
        {status === "playing" ? (
          <PauseIcon size={18} weight="fill" />
        ) : status === "ended" ? (
          <RepeatIcon size={18} />
        ) : status === "buffering" ? (
          <CircleNotchIcon className="animate-spin" size={18} weight="bold" />
        ) : (
          <PlayIcon size={18} weight="fill" />
        )}
      </Button>
    </PlaybackControl>
  );
}
