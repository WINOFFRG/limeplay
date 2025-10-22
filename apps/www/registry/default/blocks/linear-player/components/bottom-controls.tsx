import { CaptionsStateControl } from "@/registry/default/blocks/linear-player/components/captions-state-control"
import { PlaybackRateControl } from "@/registry/default/blocks/linear-player/components/playback-rate-control"
import { PlaybackStateControl } from "@/registry/default/blocks/linear-player/components/playback-state-control"
import { Playlist } from "@/registry/default/blocks/linear-player/components/playlist"
import { TimelineSliderControl } from "@/registry/default/blocks/linear-player/components/timeline-slider-control"
import { VolumeControl } from "@/registry/default/blocks/linear-player/components/volume-control"
import * as Layout from "@/registry/default/ui/player-layout"

export function BottomControls() {
  return (
    <Layout.ControlsBottomContainer>
      <PlaybackStateControl />
      <VolumeControl />
      <TimelineSliderControl />
      <PlaybackRateControl />
      <CaptionsStateControl />
      <Playlist />
    </Layout.ControlsBottomContainer>
  )
}
