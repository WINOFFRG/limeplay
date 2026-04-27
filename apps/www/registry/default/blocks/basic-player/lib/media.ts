import { mediaFeature } from "@/registry/default/hooks/use-media"
import { playbackFeature } from "@/registry/default/hooks/use-playback"
import { playerFeature } from "@/registry/default/hooks/use-player"
import { createMediaKit } from "@/registry/default/ui/media-provider"

export const media = createMediaKit({
  features: [mediaFeature(), playerFeature(), playbackFeature()] as const,
})

export const MediaProvider = media.MediaProvider
