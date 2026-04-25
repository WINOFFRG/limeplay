"use client"

import type { MediaFeature } from "@/registry/default/ui/media-provider"

import { useMediaFeatureStore } from "@/registry/default/ui/media-provider"

export const MEDIA_FEATURE_KEY = "media"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MediaProviderProps {}

export interface MediaStore {
  media: {
    debug: boolean
    forceIdle: boolean
    idle: boolean
    mediaElement: HTMLMediaElement | null
    setDebug: (value: boolean) => void
    setForceIdle: (value: boolean) => void
    setIdle: (value: boolean) => void
    setMediaElement: (element: HTMLMediaElement | null) => void
  }
}

export function mediaFeature(
  props?: { debug?: boolean }
): MediaFeature<MediaStore> {
  return {
    createSlice: (set) => ({
      media: {
        debug: props?.debug ?? false,
        forceIdle: false,
        idle: false,
        mediaElement: null,
          setDebug: (value) => {
            set(({ media }) => {
              media.debug = value
            })
          },
          setForceIdle: (value) => {
            set(({ media }) => {
              media.forceIdle = value
            })
          },
          setIdle: (value) => {
            set(({ media }) => {
              media.idle = value
            })
          },
        setMediaElement: (element) => {
          set(({ media }) => {
            media.mediaElement = element
          })
        },
      },
    }),

    key: MEDIA_FEATURE_KEY,
  }
}

export function useMediaStore<TSelected>(
  selector: (state: MediaStore["media"]) => TSelected
): TSelected {
  return useMediaFeatureStore<MediaStore, TSelected>(MEDIA_FEATURE_KEY, (state) =>
    selector(state.media)
  )
}
