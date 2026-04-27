import React from "react"

import type {
  MediaEventSlice,
  MediaFeature,
} from "@/registry/default/ui/media-provider"

import { useMediaStore } from "@/registry/default/hooks/use-media"
import { noop, off, on } from "@/registry/default/lib/utils"
import {
  useMediaEvents,
  useMediaFeatureApi,
  useMediaFeatureStore,
} from "@/registry/default/ui/media-provider"

export const PICTURE_IN_PICTURE_FEATURE_KEY = "pictureInPicture"

export interface PictureInPictureEvents {
  enterpictureinpicture: void
  leavepictureinpicture: void
}

export interface PictureInPictureStore extends MediaEventSlice<PictureInPictureEvents> {
  [PICTURE_IN_PICTURE_FEATURE_KEY]: {
    active: boolean
    enter: () => Promise<void>
    exit: () => Promise<void>
    supported: boolean
    toggle: () => Promise<void>
  }
}

interface ExtendedHTMLVideoElement extends HTMLVideoElement {
  webkitPresentationMode?: string
  webkitSetPresentationMode?: (mode: string) => void
  webkitSupportsPresentationMode?: (mode: string) => boolean
}

export function pictureInPictureFeature(): MediaFeature<PictureInPictureStore> {
  return {
    createSlice: (_set, get) => ({
      [PICTURE_IN_PICTURE_FEATURE_KEY]: {
        active: false,
        enter: async () => {
          const media = get().media
            .mediaElement as ExtendedHTMLVideoElement | null
          if (!media || media.nodeName.toLowerCase() !== "video") return

          try {
            if (isWebkitPictureInPictureSupported(media)) {
              media.webkitSetPresentationMode!("picture-in-picture")
            } else {
              await media.requestPictureInPicture()
            }
          } catch (error) {
            console.error("Failed to enter Picture-in-Picture mode:", error)
          }
        },
        exit: async () => {
          const media = get().media
            .mediaElement as ExtendedHTMLVideoElement | null
          if (!media) return

          try {
            if (isWebkitPictureInPictureSupported(media)) {
              media.webkitSetPresentationMode!("inline")
            } else if (document.pictureInPictureElement) {
              await document.exitPictureInPicture()
            }
          } catch (error) {
            console.error("Failed to exit Picture-in-Picture mode:", error)
          }
        },
        supported: false,
        toggle: async () => {
          const pip = get().pictureInPicture
          if (pip.active) {
            await pip.exit()
          } else {
            await pip.enter()
          }
        },
      },
    }),
    key: PICTURE_IN_PICTURE_FEATURE_KEY,
    Setup: PictureInPictureSetup,
  }
}

export function usePictureInPictureStore<TSelected>(
  selector: (state: PictureInPictureStore["pictureInPicture"]) => TSelected
): TSelected {
  return useMediaFeatureStore<PictureInPictureStore, TSelected>(
    PICTURE_IN_PICTURE_FEATURE_KEY,
    (state) => selector(state.pictureInPicture)
  )
}

function hasVideoTrack(media: HTMLVideoElement): boolean {
  return media.videoWidth > 0 && media.videoHeight > 0
}

function isWebkitPictureInPictureSupported(
  media: ExtendedHTMLVideoElement
): boolean {
  return (
    typeof media.webkitSupportsPresentationMode === "function" &&
    media.webkitSupportsPresentationMode("picture-in-picture") &&
    typeof media.webkitSetPresentationMode === "function"
  )
}

function PictureInPictureSetup() {
  const store = useMediaFeatureApi<PictureInPictureStore>(
    PICTURE_IN_PICTURE_FEATURE_KEY
  )
  const events = useMediaEvents<PictureInPictureEvents>()
  const mediaElement = useMediaStore((state) => state.mediaElement)

  React.useEffect(() => {
    const media = mediaElement as ExtendedHTMLVideoElement | null
    if (!media || media.nodeName.toLowerCase() !== "video") return noop

    const updatePictureInPictureSupport = () => {
      const browserSupports =
        document.pictureInPictureEnabled ||
        isWebkitPictureInPictureSupported(media)

      store.setState(({ pictureInPicture }) => {
        pictureInPicture.supported = browserSupports && hasVideoTrack(media)
      })
    }

    updatePictureInPictureSupport()

    const enterPictureInPictureHandler = () => {
      store.setState(({ pictureInPicture }) => {
        pictureInPicture.active = true
      })
      events.emit("enterpictureinpicture")
    }

    const leavePictureInPictureHandler = () => {
      store.setState(({ pictureInPicture }) => {
        pictureInPicture.active = false
      })
      events.emit("leavepictureinpicture")
    }

    const webkitPresentationModeHandler = () => {
      const isActive = media.webkitPresentationMode === "picture-in-picture"
      if (isActive) {
        enterPictureInPictureHandler()
      } else {
        leavePictureInPictureHandler()
      }
    }

    on(media, "enterpictureinpicture", enterPictureInPictureHandler)
    on(media, "leavepictureinpicture", leavePictureInPictureHandler)
    on(media, "loadedmetadata", updatePictureInPictureSupport)
    on(media, "emptied", updatePictureInPictureSupport)

    if (isWebkitPictureInPictureSupported(media)) {
      on(media, "webkitpresentationmodechanged", webkitPresentationModeHandler)
    }

    return () => {
      off(media, "enterpictureinpicture", enterPictureInPictureHandler)
      off(media, "leavepictureinpicture", leavePictureInPictureHandler)
      off(media, "loadedmetadata", updatePictureInPictureSupport)
      off(media, "emptied", updatePictureInPictureSupport)

      if (isWebkitPictureInPictureSupported(media)) {
        off(
          media,
          "webkitpresentationmodechanged",
          webkitPresentationModeHandler
        )
      }
    }
  }, [mediaElement, store])

  return null
}
