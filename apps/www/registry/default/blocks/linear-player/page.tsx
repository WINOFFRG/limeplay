import { LinearMediaPlayer } from "@/registry/default/blocks/linear-player/components/media-player"

import { ASSETS } from "./components/playlist"

export default function Page() {
  return (
    <section className="flex h-dvh w-dvw bg-black">
      <LinearMediaPlayer config={ASSETS[0].config} src={ASSETS[0].src} />
    </section>
  )
}
