import { VideoBackground } from "@/components/video-background";
import { PlayerDemoLayout } from "@/registry/default/blocks/linear-player/player-demo-root";

export default function Home() {
  return (
    <section>
      <VideoBackground />
      <PlayerDemoLayout />
    </section>
  );
}
