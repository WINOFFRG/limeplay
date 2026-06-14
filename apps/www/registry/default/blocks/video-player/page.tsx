import { VideoPlayer } from "@/registry/default/blocks/video-player/components/media-player"

const src =
  "https://ad391cc0d55b44c6a86d232548adc225.mediatailor.us-east-1.amazonaws.com/v1/master/d02fedbbc5a68596164208dd24e9b48aa60dadc7/singssai/master.m3u8"

export default function Page() {
  return (
    <section className="flex h-dvh w-dvw bg-black">
      <VideoPlayer source={src} />
    </section>
  )
}
