import { playbackFeature } from "@/registry/default/hooks/use-playback"
import { playerFeature } from "@/registry/default/hooks/use-player"
import { createMediaKit } from "@/registry/default/ui/media-provider"

export const media = createMediaKit({
  features: [playerFeature(), playbackFeature()] as const,
})

export const MediaProvider = media.MediaProvider
