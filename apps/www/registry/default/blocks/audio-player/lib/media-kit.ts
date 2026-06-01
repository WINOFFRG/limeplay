"use client"

import { assetFeature } from "@/registry/default/hooks/use-asset"
import { captionsFeature } from "@/registry/default/hooks/use-captions"
import { mediaFeature } from "@/registry/default/hooks/use-media"
import { playbackFeature } from "@/registry/default/hooks/use-playback"
import { playerFeature } from "@/registry/default/hooks/use-player"
import { playlistFeature } from "@/registry/default/hooks/use-playlist"
import { timelineFeature } from "@/registry/default/hooks/use-timeline"
import { volumeFeature } from "@/registry/default/hooks/use-volume"
import { createMediaKit } from "@/registry/default/ui/media-provider"

export const media = createMediaKit({
  features: [
    mediaFeature(),
    playerFeature(),
    playbackFeature(),
    playlistFeature(),
    volumeFeature(),
    timelineFeature(),
    captionsFeature(),
    assetFeature(),
  ] as const,
})

export const MediaProvider = media.MediaProvider
