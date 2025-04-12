import { VideoBackground } from "@/components/VideoBackground";
import { VideoPlayer } from "@/components/VideoPlayer";
import { MediaProvider } from "@/registry/default/ui/media-provider";

export default function Home() {
  return (
    <section>
      <VideoBackground />
      <MediaProvider>
        <VideoPlayer />
      </MediaProvider>
    </section>
  );
}
