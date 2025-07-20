import * as React from "react"
import { composeRefs } from "@radix-ui/react-compose-refs"

import { useVolume } from "@/registry/default/hooks/use-volume"

import { useMediaStore } from "./media-provider"

// Define a discriminated union type for the component props
type MediaProps =
  | ({ as: "video" } & React.VideoHTMLAttributes<HTMLVideoElement>)
  | ({ as: "audio" } & React.AudioHTMLAttributes<HTMLAudioElement>)

export const Media = React.forwardRef<HTMLMediaElement, MediaProps>(
  (props, forwardedRef) => {
    const { as: Element = "video", ...etc } = props
    const mediaRef = React.useRef<HTMLMediaElement>(null)
    const setMediaRef = useMediaStore((state) => state.setMediaRef)
    const status = useMediaStore((state) => state.status)
    const setStatus = useMediaStore((state) => state.setStatus)

    const { setMuted } = useVolume()

    React.useEffect(() => {
      if (!mediaRef?.current) {
        return
      }

      setMediaRef(mediaRef as React.RefObject<HTMLMediaElement>)

      if (mediaRef.current.error) {
        console.error(mediaRef.current.error)
        return
      }

      if (mediaRef.current.readyState >= 2) {
        const shouldAutoplay = mediaRef.current.autoplay
        setStatus(shouldAutoplay ? "playing" : "paused")
      }
    }, [])

    React.useEffect(() => {
      if (mediaRef.current) {
        const defaultMuted = mediaRef.current.muted
        setMuted(defaultMuted)
      }
    }, [])

    return (
      <Element
        ref={composeRefs(forwardedRef, mediaRef)}
        aria-busy={status === "buffering"}
        {...etc}
      />
    )
  }
)

Media.displayName = "Media"
