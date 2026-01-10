import {
  useGetStore,
  useMediaStore,
} from "@/registry/default/ui/media-provider"

export interface UseSeekReturn {
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
