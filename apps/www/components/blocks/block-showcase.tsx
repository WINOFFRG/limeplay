import type { ReactNode } from "react"

import { AudioPlayerDemo } from "@/components/players/audio-player/demo-player"
import { VideoPlayer } from "@/registry/default/blocks/video-player/components/media-player"

import { BlockStreamSync } from "./block-toolbar"
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
            <AudioPlayerDemo>
              <BlockStreamSync playerType="audio" />
            </AudioPlayerDemo>
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
            <VideoPlayer>
              <BlockStreamSync playerType="video" />
            </VideoPlayer>
          </BlockPreviewPane>
        </div>
      </BlockPreviewWithToolbar>
    ),
  },
} satisfies Record<string, BlockShowcaseDefinition>

export function getBlockShowcase(preview: string) {
  return blockShowcaseRegistry[preview as keyof typeof blockShowcaseRegistry]
}
