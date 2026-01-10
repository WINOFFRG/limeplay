"use client"

import { composeRefs } from "@radix-ui/react-compose-refs"
import * as React from "react"

import { useMediaStore } from "@/registry/default/ui/media-provider"

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
    const mediaRef = React.useRef<HTMLMediaElement>(null)
    const setMediaRef = useMediaStore((state) => state.setMediaRef)
    const status = useMediaStore((state) => state.status)

    React.useLayoutEffect(() => {
      if (!mediaRef.current) {
        return
      }

      setMediaRef(mediaRef as React.RefObject<HTMLMediaElement>)
    }, [])

    return (
      <Element
        aria-busy={status === "buffering"}
        controls={false}
        ref={composeRefs(forwardedRef, mediaRef)}
        {...etc}
      />
    )
  }
)

Media.displayName = "Media"
