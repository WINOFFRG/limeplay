import { useMediaStore } from "@/registry/default/hooks/use-media"
import { useMediaApi } from "@/registry/default/ui/media-provider"

export function useSeek() {
  const store = useMediaApi()
  const mediaElement = useMediaStore((state) => state.mediaElement)

  function seek(offset: number) {
    if (!mediaElement) {
      return
    }

    const media = mediaElement
    const newTime = media.currentTime + offset

    media.currentTime = Math.max(0, Math.min(newTime, media.duration || 0))

    store.setState((state) => ({
      media: {
        ...state.media,
        idle: false,
      },
    }))
  }

  return {
    seek,
  }
}
