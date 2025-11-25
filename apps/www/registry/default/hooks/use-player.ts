import React from "react";
import type shaka from "shaka-player";
import type { StateCreator } from "zustand";

import { noop, off, on } from "@/registry/default/lib/utils";
import {
  useGetStore,
  useMediaStore,
} from "@/registry/default/ui/media-provider";

export type MediaStatus =
  | "init"
  | "loading"
  | "buffering"
  | "canplay"
  | "canplaythrough"
  | "ended"
  | "error"
  | "paused"
  | "playing"
  | "stopped";

export const MediaReadyState = {
  HAVE_NOTHING: 0,
  HAVE_METADATA: 1,
  HAVE_CURRENT_DATA: 2,
  HAVE_FUTURE_DATA: 3,
  HAVE_ENOUGH_DATA: 4,
} as const;

export type MediaReadyState =
  (typeof MediaReadyState)[keyof typeof MediaReadyState];

export type PlayerStore = {
  idle: boolean;
  setIdle: (idle: boolean) => void;
  mediaRef: React.RefObject<HTMLMediaElement | null>;
  setMediaRef: (mediaRef: React.RefObject<HTMLMediaElement>) => void;
  player: shaka.Player | null;
  setPlayer: (player: shaka.Player | null) => void;
  debug: boolean;
  setDebug: (value: boolean) => void;
  playerContainerRef: HTMLDivElement | null;
  setPlayerContainerRef: (instance: HTMLDivElement | null) => void;
  forceIdle: boolean;
  setForceIdle: (value: boolean) => void;
  // Media State Store
  paused: boolean;
  ended: boolean;
  loop: boolean;
  status: MediaStatus;
  readyState: MediaReadyState;
  canPlay: boolean;
  canPlayThrough: boolean;
  error: MediaError | null;
  networkState: number;
};

export const createPlayerStore: StateCreator<
  PlayerStore,
  [],
  [],
  PlayerStore
> = (set) => ({
  idle: false,
  setIdle: (idle: boolean) => set({ idle }),
  mediaRef: React.createRef<HTMLMediaElement>(),
  setMediaRef: (mediaRef: React.RefObject<HTMLMediaElement>) =>
    set({ mediaRef }),
  player: null,
  setPlayer: (player: shaka.Player | null) => set({ player }),
  debug: false,
  setDebug: (value) => set({ debug: value }),
  playerContainerRef: null,
  setPlayerContainerRef: (instance) => set({ playerContainerRef: instance }),
  forceIdle: false,
  setForceIdle: (value) => set({ forceIdle: value }),
  paused: false,
  ended: false,
  loop: false,
  status: "init",
  readyState: MediaReadyState.HAVE_NOTHING,
  canPlay: false,
  canPlayThrough: false,
  error: null,
  networkState: 0,
});

export function usePlayerStates() {
  const store = useGetStore();
  const mediaRef = useMediaStore((state) => state.mediaRef);
  const player = useMediaStore((state) => state.player);

  React.useEffect(() => {
    if (!mediaRef.current) {
      return noop;
    }

    const media = mediaRef.current;

    const setInitialState = () => {
      const isBuffering = player?.isBuffering();
      const status: MediaStatus = isBuffering
        ? "buffering"
        : media.paused
          ? "paused"
          : "playing";

      store.setState({
        paused: media.paused,
        ended: media.ended,
        loop: media.loop,
        status,
        readyState: media.readyState as MediaReadyState,
        canPlay: media.readyState >= MediaReadyState.HAVE_FUTURE_DATA,
        canPlayThrough: media.readyState >= MediaReadyState.HAVE_ENOUGH_DATA,
        error: media.error,
        networkState: media.networkState,
      });
    };

    // Playback event handlers
    const pauseHandler = () => {
      store.setState({
        paused: true,
        status: "paused",
      });
    };

    const playHandler = () => {
      store.setState({
        paused: false,
        status: "playing",
      });
    };

    const playingHandler = () => {
      store.setState({
        paused: false,
        status: "playing",
      });
    };

    const endedHandler = () => {
      // DEV: When looping, ended event should be ignored to prevent UI showing ended state
      if (media.loop) {
        return;
      }
      store.setState({
        ended: true,
        status: "ended",
      });
    };

    // Loading event handlers
    const loadStartHandler = () => {
      store.setState({
        status: "loading",
        error: null,
      });
    };

    const loadedMetadataHandler = () => {
      store.setState({
        ended: false,
        readyState: media.readyState as MediaReadyState,
      });
    };

    const loadedDataHandler = () => {
      store.setState({
        ended: false,
        readyState: media.readyState as MediaReadyState,
        canPlay: media.readyState >= MediaReadyState.HAVE_FUTURE_DATA,
      });
    };

    const canPlayHandler = () => {
      store.setState({
        canPlay: true,
        readyState: media.readyState as MediaReadyState,
        status: media.paused ? "paused" : "playing",
      });
    };

    const canPlayThroughHandler = () => {
      store.setState({
        canPlay: true,
        canPlayThrough: true,
        readyState: media.readyState as MediaReadyState,
        status: media.paused ? "paused" : "playing",
      });
    };

    const readyStateChangeHandler = () => {
      const readyState = media.readyState as MediaReadyState;

      store.setState({
        readyState,
        canPlay: readyState >= MediaReadyState.HAVE_FUTURE_DATA,
        canPlayThrough: readyState >= MediaReadyState.HAVE_ENOUGH_DATA,
      });
    };

    const waitingHandler = () => {
      store.setState({ status: "buffering" });
    };

    const stalledHandler = () => {
      store.setState({ status: "buffering" });
    };

    const errorHandler = () => {
      store.setState({
        error: media.error,
        status: "error",
      });
    };

    const loopChangeHandler = () => {
      store.setState({
        loop: media.loop,
      });
    };

    on(media, "loadstart", loadStartHandler);
    on(media, "loadedmetadata", loadedMetadataHandler);
    on(media, "loadeddata", loadedDataHandler);
    on(media, "canplay", canPlayHandler);
    on(media, "canplaythrough", canPlayThroughHandler);
    on(media, "readystatechange", readyStateChangeHandler);
    on(media, "play", playHandler);
    on(media, "playing", playingHandler);
    on(media, "pause", pauseHandler);
    on(media, "ended", endedHandler);
    on(media, "waiting", waitingHandler);
    on(media, "stalled", stalledHandler);
    on(media, "error", errorHandler);
    on(media, "loopchange", loopChangeHandler);

    setInitialState();

    return () => {
      off(media, "loadstart", loadStartHandler);
      off(media, "loadedmetadata", loadedMetadataHandler);
      off(media, "loadeddata", loadedDataHandler);
      off(media, "canplay", canPlayHandler);
      off(media, "canplaythrough", canPlayThroughHandler);
      off(media, "readystatechange", readyStateChangeHandler);
      off(media, "play", playHandler);
      off(media, "playing", playingHandler);
      off(media, "pause", pauseHandler);
      off(media, "ended", endedHandler);
      off(media, "waiting", waitingHandler);
      off(media, "stalled", stalledHandler);
      off(media, "error", errorHandler);
      off(media, "loopchange", loopChangeHandler);
    };
  }, [store, mediaRef, player]);

  React.useEffect(() => {
    if (!player) {
      return noop;
    }

    const bufferingHandler = () => {
      const isBuffering = player.isBuffering();

      if (isBuffering) {
        store.setState({ status: "buffering" });
      } else {
        const media = mediaRef.current;
        if (media) {
          const status = media.paused ? "paused" : "playing";
          store.setState({ status });
        }
      }
    };

    const loadingHandler = () => {
      store.setState({ status: "loading" });
    };

    player.addEventListener("buffering", bufferingHandler);
    player.addEventListener("loading", loadingHandler);

    return () => {
      player.removeEventListener("buffering", bufferingHandler);
      player.removeEventListener("loading", loadingHandler);
    };
  }, [player, mediaRef, store]);
}

export function usePlayer() {
  const store = useGetStore();

  function play() {
    const media = store.getState().mediaRef.current;
    if (!media) {
      return;
    }

    media.play().catch((error: unknown) => {
      console.error("Error playing media", error);
      store.setState({
        status: "error",
        idle: false,
      });
    });

    store.setState({
      idle: false,
    });
  }

  function pause() {
    const media = store.getState().mediaRef.current;
    if (!media) {
      return;
    }

    media.pause();

    store.setState({
      idle: false,
    });
  }

  function togglePaused() {
    const media = store.getState().mediaRef.current;
    if (!media) {
      return;
    }

    if (media.paused) {
      play();
    } else {
      pause();
    }
  }

  function setLoop(loop: boolean) {
    const media = store.getState().mediaRef.current;
    if (!media) {
      return;
    }

    media.loop = loop;

    store.setState({
      idle: false,
    });
  }

  function toggleLoop() {
    const media = store.getState().mediaRef.current;
    if (!media) {
      return;
    }

    setLoop(!media.loop);
  }

  function restart() {
    const media = store.getState().mediaRef.current;
    if (!media) {
      return;
    }

    media.currentTime = 0;
    if (media.paused) {
      play();
    }

    store.setState({
      ended: false,
      idle: false,
    });
  }

  return {
    play,
    pause,
    togglePaused,
    setLoop,
    toggleLoop,
    restart,
  };
}
