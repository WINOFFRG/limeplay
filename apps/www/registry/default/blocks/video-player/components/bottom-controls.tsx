import { CaptionsStateControl } from "@/registry/default/blocks/video-player/components/captions-state-control"
import { PictureInPictureControl } from "@/registry/default/blocks/video-player/components/pip-control"
import { PlaybackRateControl } from "@/registry/default/blocks/video-player/components/playback-rate-control"
import { PlaybackStateControl } from "@/registry/default/blocks/video-player/components/playback-state-control"
import { Playlist } from "@/registry/default/blocks/video-player/components/playlist"
import { TimelineSliderControl } from "@/registry/default/blocks/video-player/components/timeline-slider-control"
import { VolumeGroupControl } from "@/registry/default/blocks/video-player/components/volume-group-control"
import * as Layout from "@/registry/default/ui/player-layout"

export function BottomControls() {
  return (
    <Layout.ControlsBottomContainer>
      <PlaybackStateControl />
      <VolumeGroupControl />
      <TimelineSliderControl />
      <PlaybackRateControl />
      <CaptionsStateControl />
      <PictureInPictureControl />
      <Playlist />
    </Layout.ControlsBottomContainer>
  )
}
