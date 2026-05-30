import type { ReactNode } from "react"

import { AudioPlayerDemo } from "@/components/players/audio-player/demo-player"
import { VIDEO_PLAYER_DEMO_ASSETS } from "@/components/players/video-player/demo-assets"
import { VideoPlayer } from "@/registry/default/blocks/video-player/components/media-player"

import { BlockPreviewPane } from "./preview-background"
import { BlockPreviewWithToolbar } from "./preview-pane"

type BlockShowcaseDefinition = {
  component: () => ReactNode
}

const blockShowcaseRegistry = {
  "audio-player": {
    component: () => (
      <BlockPreviewWithToolbar>
        <div className="flex size-full items-end">
          <BlockPreviewPane>
            <AudioPlayerDemo />
          </BlockPreviewPane>
        </div>
      </BlockPreviewWithToolbar>
    ),
  },
  "video-player": {
    component: () => (
      <BlockPreviewWithToolbar>
        <div className="flex size-full">
          <BlockPreviewPane>
            <VideoPlayer playlist={VIDEO_PLAYER_DEMO_ASSETS} />
          </BlockPreviewPane>
        </div>
      </BlockPreviewWithToolbar>
    ),
  },
} satisfies Record<string, BlockShowcaseDefinition>

export function getBlockShowcase(preview: string) {
  return blockShowcaseRegistry[preview as keyof typeof blockShowcaseRegistry]
}
