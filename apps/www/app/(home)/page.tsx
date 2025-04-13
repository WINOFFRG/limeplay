import { VideoBackground } from "@/components/VideoBackground";
import { PlayerDemoLayout } from "@/registry/default/blocks/linear-player/player-demo-root";

export default function Home() {
  return (
    <section>
      <VideoBackground />
      <PlayerDemoLayout />
    </section>
  );
}
