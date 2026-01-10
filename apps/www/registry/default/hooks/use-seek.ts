import {
  useGetStore,
  useMediaStore,
} from "@/registry/default/ui/media-provider"

/**
 * Return type for the useSeek hook.
 * Provides functionality to seek forward or backward in media playback.
 */
export interface UseSeekReturn {
  /**
   * Seeks to a relative position in the media timeline.
   * @param offset - Number of seconds to seek (positive for forward, negative for backward)
   */
  seek: (offset: number) => void
}

export function useSeek(): UseSeekReturn {
  const store = useGetStore()
  const mediaRef = useMediaStore((state) => state.mediaRef)

  function seek(offset: number) {
    if (!mediaRef.current) {
      return
    }

    const media = mediaRef.current
    const newTime = media.currentTime + offset

    media.currentTime = Math.max(0, Math.min(newTime, media.duration || 0))

    store.setState({
      idle: false,
    })
  }

  return {
    seek,
  }
}
