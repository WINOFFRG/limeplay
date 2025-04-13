import React from "react";

import { noop, off, on } from "@/registry/default/lib/utils";
import { useMediaStore } from "@/registry/default/ui/media-provider";

export function useVolumeStates() {
  const mediaRef = useMediaStore((state) => state.mediaRef);
  const volume = useMediaStore((state) => state.volume);
  const setVolume = useMediaStore((state) => state.setVolume);
  const muted = useMediaStore((state) => state.muted);
  const setMuted = useMediaStore((state) => state.setMuted);

  React.useEffect(() => {
    const mediaElement = mediaRef?.current;

    if (mediaElement) {
      mediaElement.volume = volume;
      mediaElement.muted = muted;
    }
  }, [volume, muted, mediaRef]);

  React.useEffect(() => {
    const mediaElement = mediaRef?.current;
    if (!mediaElement) return noop;

    const volumeHandler = () => {
      setVolume(mediaElement.volume);
      setMuted(mediaElement.muted);
    };

    on(mediaElement, "volumechange", volumeHandler);

    return () => {
      off(mediaElement, "volumechange", volumeHandler);
    };
  }, [mediaRef]);
}
