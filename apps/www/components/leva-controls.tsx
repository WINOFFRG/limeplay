import { useEffect, useState } from "react"
import { Leva, useControls } from "leva"

import { useMediaStore } from "@/registry/default/ui/media-provider"

declare global {
  interface Window {
    leve_controls_mounted?: boolean
  }
}

export function LevaControls() {
  const [shouldRender, setShouldRender] = useState(false)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const [isClient, setIsClient] = useState(false)

  const { paused, muted, volume, loop } = useControls({
    paused: {
      value: false,
      label: "Paused",
    },
    muted: {
      value: false,
      label: "Muted",
    },
    volume: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
      label: "Volume",
    },
    loop: {
      value: false,
      label: "Loop",
    },
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (mediaRef && mediaRef.current) {
      if (paused) {
        mediaRef.current.pause()
      } else {
        mediaRef.current.play().catch((error) => {
          console.warn("Error playing media:", error)
        })
      }
    }
  }, [paused, mediaRef])

  useEffect(() => {
    if (mediaRef && mediaRef.current) {
      mediaRef.current.muted = muted
    }
  }, [muted, mediaRef])

  useEffect(() => {
    if (mediaRef && mediaRef.current) {
      mediaRef.current.volume = volume
    }
  }, [volume, mediaRef])

  useEffect(() => {
    if (mediaRef && mediaRef.current) {
      mediaRef.current.loop = loop
    }
  }, [loop, mediaRef])

  useEffect(() => {
    if (typeof window === "undefined") return

    if (window.leve_controls_mounted) {
      setShouldRender(false)
      return
    }

    window.leve_controls_mounted = true
    setShouldRender(true)

    return () => {
      window.leve_controls_mounted = false
    }
  }, [])

  if (!shouldRender || !isClient) {
    return null
  }

  return (
    <div className="absolute right-0 z-100 me-2 mt-2 overflow-hidden rounded-lg">
      <Leva
        titleBar={{
          title: "Player Controls",
        }}
        collapsed
      />
    </div>
  )
}
