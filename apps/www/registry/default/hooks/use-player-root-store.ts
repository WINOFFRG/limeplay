import React from "react";
import shaka from "shaka-player";
import type { StateCreator } from "zustand";

export interface PlayerRootStore {
  idle: boolean;
  setIdle: (idle: boolean) => void;
  status: MediaStatus;
  setStatus: (status: MediaStatus) => void;
  mediaRef: React.RefObject<HTMLMediaElement>;
  setMediaRef: (mediaRef: React.RefObject<HTMLMediaElement>) => void;
  // Player Engine
  player: shaka.Player | null;
  setPlayer: (player: shaka.Player | null) => void;
  debug: boolean;
  setDebug: (value: boolean) => void;
  playerContainerRef: HTMLDivElement | null;
  setPlayerContainerRef: (instance: HTMLDivElement | null) => void;
}

export type MediaStatus =
  | "init"
  | "buffering"
  | "ended"
  | "error"
  | "paused"
  | "playing"
  | "stopped";

export const createPlayerRootStore: StateCreator<
  PlayerRootStore,
  [],
  [],
  PlayerRootStore
> = (set) => ({
  idle: false,
  setIdle: (idle: boolean) => set({ idle }),
  status: "init",
  setStatus: (status: MediaStatus) => set({ status }),
  mediaRef: null!,
  setMediaRef: (mediaRef: React.RefObject<HTMLMediaElement>) =>
    set({ mediaRef }),
  player: null,
  setPlayer: (player: shaka.Player | null) => set({ player }),
  debug: false,
  setDebug: (value) => set({ debug: value }),
  playerContainerRef: null,
  setPlayerContainerRef: (instance) => set({ playerContainerRef: instance }),
});
