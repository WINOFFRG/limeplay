"use client"

import type { StateCreator } from "zustand"

import React from "react"

export interface PlaybackStore {
  debug: boolean
  idle: boolean
  mediaRef: React.RefObject<HTMLMediaElement | null>
  setDebug: (value: boolean) => void
  setIdle: (idle: boolean) => void
  setMediaRef: (mediaRef: React.RefObject<HTMLMediaElement | null>) => void
}

export const createPlaybackStore: StateCreator<
  PlaybackStore,
  [],
  [],
  PlaybackStore
> = (set) => ({
  debug: false,
  idle: false,
  mediaRef: React.createRef<HTMLMediaElement>(),
  setDebug: (debug) => set({ debug }),
  setIdle: (idle) => set({ idle }),
  setMediaRef: (mediaRef) => set({ mediaRef }),
})
