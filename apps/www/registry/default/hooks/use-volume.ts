import clamp from "lodash.clamp";
import React from "react";
import type { StateCreator } from "zustand";

import type { PlayerStore } from "@/registry/default/hooks/use-player";
import { noop, off, on } from "@/registry/default/lib/utils";
import {
  useGetStore,
  useMediaStore,
} from "@/registry/default/ui/media-provider";

export function useVolumeStates() {
  const store = useGetStore();
  const mediaRef = useMediaStore((state) => state.mediaRef);
  const player = useMediaStore((state) => state.player);

  React.useEffect(() => {
    if (!mediaRef.current) {
      return noop;
    }

    const media = mediaRef.current;

    const volumeHandler = () => {
      store.setState({
        volume: media.volume,
        muted: media.muted,
      });
    };

    const audioTracksChangedHandler = () => {
      if (player) {
        const hasAudioTracks = player.getAudioTracks().length > 0;

        store.setState({
          hasAudio: hasAudioTracks,
        });
      }
    };

    on(media, "volumechange", volumeHandler);
    on(media, "audiotrackschanged", audioTracksChangedHandler);

    volumeHandler();

    return () => {
      off(media, "volumechange", volumeHandler);
      off(media, "audiotrackschanged", audioTracksChangedHandler);
    };
  }, [store, mediaRef, player]);
}

export type VolumeStore = {
  volume: number;
  muted: boolean;
  hasAudio: boolean;
};

const BASE_RESET_VOLUME = 0.05;

export const createVolumeStore: StateCreator<
  VolumeStore & PlayerStore,
  [],
  [],
  VolumeStore
> = () => ({
  volume: 1,
  muted: false,
  hasAudio: true,
});

export function useVolume() {
  const store = useGetStore();
  const mediaRef = useMediaStore((state) => state.mediaRef);

  function setVolume(volume: number, progress = 0, delta = 0) {
    if (!mediaRef.current) {
      return;
    }

    const value = typeof delta === "number" ? volume + delta : progress;

    if (Number.isNaN(value)) {
      return;
    }

    const clampedVolume = clamp(value, 0, 1);
    const muted = clampedVolume === 0;

    const media = mediaRef.current;
    media.volume = clampedVolume;
    media.muted = muted;

    store.setState({
      idle: false,
    });
  }

  function toggleMute() {
    if (!mediaRef.current) {
      return;
    }

    const media = mediaRef.current;
    media.muted = !media.muted;
    // DEV: Volume 0 and muted are equivalent, to prevent collision in UI
    // set to some small value to prevent stuck toggling state of UI.
    if (!media.muted) {
      media.volume = media.volume === 0 ? BASE_RESET_VOLUME : media.volume;
    }

    store.setState({
      idle: false,
    });
  }

  function setMuted(muted: boolean) {
    if (!mediaRef.current) {
      return;
    }

    const media = mediaRef.current;

    media.muted = muted;
    media.volume = muted ? BASE_RESET_VOLUME : media.volume;

    store.setState({
      idle: false,
    });
  }

  return {
    setVolume,
    toggleMute,
    setMuted,
  };
}
