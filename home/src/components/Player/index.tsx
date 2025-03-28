/* eslint-disable jsx-a11y/media-has-caption */
import { LimeplayProvider, MediaOutlet } from "@limeplay/core"
import { createStyles } from "@mantine/styles"

import { PlayerOutlet } from "@/components/Player/PlayerOverlay"

import { PlayerError } from "../PlayerError"

const useStyles = createStyles((theme) => ({
  videoElement: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    opacity: 1,
    zIndex: 1,
  },
}))

export default function Player() {
  const { classes } = useStyles()

  return (
    <LimeplayProvider>
      <PlayerOutlet />
      <MediaOutlet>
        <video
          controls={false}
          playsInline
          autoPlay
          className={classes.videoElement}
          poster="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/animated.webp?start=268&end=278&width=640"
        />
      </MediaOutlet>
    </LimeplayProvider>
  )
}
