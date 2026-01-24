import type { StateCreator } from "zustand"

import React from "react"

import { noop, off, on } from "@/registry/default/lib/utils"
import {
  useGetStore,
  useMediaStore,
} from "@/registry/default/ui/media-provider"

export interface PictureInPictureStore {
  isPictureInPictureActive: boolean
  isPictureInPictureSupported: boolean
  onEnterPictureInPicture?: () => void
  onLeavePictureInPicture?: () => void
}

interface ExtendedHTMLVideoElement extends HTMLVideoElement {
  webkitPresentationMode?: string
  webkitSetPresentationMode?: (mode: string) => void
  webkitSupportsPresentationMode?: (mode: string) => boolean
}

export const createPictureInPictureStore: StateCreator<
  PictureInPictureStore,
  [],
  [],
  PictureInPictureStore
> = () => ({
  isPictureInPictureActive: false,
  isPictureInPictureSupported: false,
  onEnterPictureInPicture: undefined,
  onLeavePictureInPicture: undefined,
})

export interface UsePictureInPictureReturn {
  enterPictureInPicture: () => Promise<void>
  exitPictureInPicture: () => Promise<void>
  togglePictureInPicture: () => Promise<void>
}

export function usePictureInPicture(): UsePictureInPictureReturn {
  const store = useGetStore()

  async function enterPictureInPicture() {
    const media = store.getState().mediaRef
      .current as ExtendedHTMLVideoElement | null
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
  }

  async function exitPictureInPicture() {
    const media = store.getState().mediaRef
      .current as ExtendedHTMLVideoElement | null

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
  }

  async function togglePictureInPicture() {
    const isPictureInPictureActive = store.getState().isPictureInPictureActive

    if (isPictureInPictureActive) {
      await exitPictureInPicture()
    } else {
      await enterPictureInPicture()
    }
  }

  return {
    enterPictureInPicture,
    exitPictureInPicture,
    togglePictureInPicture,
  }
}

export function usePictureInPictureStates() {
  const store = useGetStore()
  const mediaRef = useMediaStore((state) => state.mediaRef)

  React.useEffect(() => {
    const media = mediaRef.current as ExtendedHTMLVideoElement | null
    if (!media || media.nodeName.toLowerCase() !== "video") return noop

    const isPictureInPictureSupported =
      document.pictureInPictureEnabled ||
      isWebkitPictureInPictureSupported(media)

    store.setState({
      isPictureInPictureSupported,
    })

    const enterPictureInPictureHandler = () => {
      store.setState({ isPictureInPictureActive: true })
      store.getState().onEnterPictureInPicture?.()
    }

    const leavePictureInPictureHandler = () => {
      store.setState({ isPictureInPictureActive: false })
      store.getState().onLeavePictureInPicture?.()
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

    if (isWebkitPictureInPictureSupported(media)) {
      on(media, "webkitpresentationmodechanged", webkitPresentationModeHandler)
    }

    return () => {
      off(media, "enterpictureinpicture", enterPictureInPictureHandler)
      off(media, "leavepictureinpicture", leavePictureInPictureHandler)

      if (isWebkitPictureInPictureSupported(media)) {
        off(
          media,
          "webkitpresentationmodechanged",
          webkitPresentationModeHandler
        )
      }
    }
  }, [store, mediaRef])
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
