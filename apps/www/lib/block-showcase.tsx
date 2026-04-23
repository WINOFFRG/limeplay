import type { ReactNode } from "react"

import { LinearMediaPlayer } from "@/registry/default/blocks/linear-player/components/media-player"
import { YouTubeMusicPlayer } from "@/registry/pro/blocks/youtube-music/components/media-player"

type BlockShowcaseDefinition = {
  component: () => ReactNode
}

const blockShowcaseRegistry = {
  "linear-player": {
    component: () => (
      <section className="dark flex h-dvh w-dvw bg-black">
        <LinearMediaPlayer as="video" />
      </section>
    ),
  },
  "youtube-music": {
    component: () => <YouTubeMusicPlayer />,
  },
} satisfies Record<string, BlockShowcaseDefinition>

export function getBlockShowcase(preview: string) {
  return blockShowcaseRegistry[preview as keyof typeof blockShowcaseRegistry]
}
