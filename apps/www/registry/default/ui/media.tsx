"use client"

import { useComposedRefs } from "@radix-ui/react-compose-refs"
import * as React from "react"

import { useMediaStore } from "@/registry/default/hooks/use-media"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"

export type MediaProps =
  | (React.AudioHTMLAttributes<HTMLAudioElement> & { as: "audio" })
  | (React.VideoHTMLAttributes<HTMLVideoElement> & {
      /**
       * Type of Media Element to Render
       *
       * @default video
       */
      as: "video"
    })

export type MediaPropsDocs = Pick<MediaProps, "as">

export const Media = React.forwardRef<HTMLMediaElement, MediaProps>(
  (props, forwardedRef) => {
    const { as: Element = "video", ...etc } = props
    const setMediaElement = useMediaStore((state) => state.setMediaElement)
    const status = usePlaybackStore((state) => state.status)
    const composedRef = useComposedRefs(forwardedRef, setMediaElement)

    return (
      <Element
        aria-busy={status === "buffering" || status === "loading"}
        controls={false}
        {...etc}
        ref={composedRef}
      />
    )
  }
)

Media.displayName = "Media"
