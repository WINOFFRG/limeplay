import { LinearMediaPlayer } from "@/registry/default/blocks/linear-player/components/media-player";

export default function Page() {
  return (
    <section className="flex h-dvh w-dvw bg-black">
      <LinearMediaPlayer src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8" />
    </section>
  );
}
