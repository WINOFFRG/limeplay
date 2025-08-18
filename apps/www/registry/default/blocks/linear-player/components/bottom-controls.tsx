// import { ChatTextIcon } from "@phosphor-icons/react"

// import { Button } from "@/components/ui/button"
import { PlaybackStateControl } from "@/registry/default/blocks/linear-player/components/playback-state-control"
import { Playlist } from "@/registry/default/blocks/linear-player/components/playlist"
import { TimelineSliderControl } from "@/registry/default/blocks/linear-player/components/timeline-slider-control"
import { VolumeSliderControl } from "@/registry/default/blocks/linear-player/components/volume-slider-control"
import { VolumeStateControl } from "@/registry/default/blocks/linear-player/components/volume-state-control"

export function BottomControls() {
  return (
    <>
      <PlaybackStateControl />
      <div
        className={`
          group me-2 flex min-w-22 items-center gap-2 rounded-md pe-2 transition-all duration-300 ease-in-out
          hover:bg-primary/10 hover:backdrop-blur-md
          focus-visible:bg-primary/10 focus-visible:ring-primary/50
          `}
      >
        <VolumeStateControl />
        <VolumeSliderControl />
      </div>
      <TimelineSliderControl />
      <Playlist />
      {/* <Button size="icon" variant="glass" aria-label="Open episodes">
        <ChatTextIcon weight="fill" />
        </Button> */}
    </>
  )
}
