import type { ReactNode } from "react"

import { AudioPlayerDemo } from "@/components/players/audio-player/demo-player"
import { VideoPlayer } from "@/registry/default/blocks/video-player/player"
import { AmbientPlayer } from "@/registry/pro/blocks/ambient-player/player"
import { ImmersivePlayer } from "@/registry/pro/blocks/immersive-player/player"

import { BlockStreamSync } from "./block-stream-sync"
import { BlockPreviewPane } from "./preview-background"
import { BlockPreviewWithToolbar } from "./preview-pane"

type BlockShowcaseDefinition = {
  component: () => ReactNode
}

const blockShowcaseRegistry = {
  "ambient-player": {
    component: () => (
      <BlockPreviewWithToolbar>
        <div className="flex size-full">
          <BlockPreviewPane>
            <AmbientPlayer layout="fill">
              <BlockStreamSync playerType="video" />
            </AmbientPlayer>
          </BlockPreviewPane>
        </div>
      </BlockPreviewWithToolbar>
    ),
  },
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
  "immersive-player": {
    component: () => (
      <BlockPreviewWithToolbar>
        <div className="flex size-full">
          <BlockPreviewPane>
            <ImmersivePlayer layout="fill">
              <BlockStreamSync playerType="video" />
            </ImmersivePlayer>
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
            <VideoPlayer layout="fill" mediaProps={{ className: "bg-black" }}>
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
