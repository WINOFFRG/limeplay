import * as React from "react"
import { composeRefs } from "@radix-ui/react-compose-refs"

import { useMediaStore } from "@/registry/default/ui/media-provider"

export type MediaPropsDocs = Pick<MediaProps, "as">

export type MediaProps =
  | ({
      /**
       * Type of Media Element to Render
       *
       * @default video
       */
      as: "video"
    } & React.VideoHTMLAttributes<HTMLVideoElement>)
  | ({ as: "audio" } & React.AudioHTMLAttributes<HTMLAudioElement>)

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
    }, [mediaRef, setMediaRef])

    return (
      <Element
        controls={false}
        ref={composeRefs(forwardedRef, mediaRef)}
        aria-busy={status === "buffering"}
        {...etc}
      />
    )
  }
)

Media.displayName = "Media"
