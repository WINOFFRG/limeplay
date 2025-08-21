import { LimeplayMediaPlayer } from "@/registry/default/blocks/basic-player/components/media-player"

export default function Page() {
  return (
    <section className="dark flex h-dvh w-dvw bg-black">
      <LimeplayMediaPlayer src="https://ad391cc0d55b44c6a86d232548adc225.mediatailor.us-east-1.amazonaws.com/v1/master/d02fedbbc5a68596164208dd24e9b48aa60dadc7/singssai/master.m3u8" />
    </section>
  )
}
