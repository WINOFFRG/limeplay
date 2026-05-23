import type { ReactNode } from "react"

import { LinearMediaPlayer } from "@/registry/default/blocks/linear-player/components/media-player"
import { YouTubeMusicPlayer } from "@/registry/pro/blocks/youtube-music/components/media-player"

import { BlockPreviewPane } from "./preview-background"
import { BlockPreviewWithToolbar } from "./preview-pane"

type BlockShowcaseDefinition = {
  component: () => ReactNode
}

const blockShowcaseRegistry = {
  "linear-player": {
    component: () => (
      <BlockPreviewWithToolbar>
        <div className="flex size-full">
          <BlockPreviewPane>
            <LinearMediaPlayer as="video" />
          </BlockPreviewPane>
        </div>
      </BlockPreviewWithToolbar>
    ),
  },
  "youtube-music": {
    component: () => (
      <BlockPreviewWithToolbar>
        <div className="flex size-full items-end">
          <BlockPreviewPane>
            <YouTubeMusicPlayer />
          </BlockPreviewPane>
        </div>
      </BlockPreviewWithToolbar>
    ),
  },
} satisfies Record<string, BlockShowcaseDefinition>

export function getBlockShowcase(preview: string) {
  return blockShowcaseRegistry[preview as keyof typeof blockShowcaseRegistry]
}
