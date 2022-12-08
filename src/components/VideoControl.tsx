import usePlayerStore from "../store";
import styles from "./styles";
import PauseIcon from "./PauseIcon";
import PlayIcon from "./PlayIcon";
import { memo } from "react";
import shallow from "zustand/shallow";

function VideoControl({ video }: { video: HTMLVideoElement | null }) {
    const [isPlaying, setIsPlaying] = usePlayerStore(
        (state: any) => [state.playing, state.setPlaying],
        shallow
    );

    return (
        <div className="player-control">
            {
                <button
                    style={styles.playPauseIcon}
                    onClick={() => {
                        if (video) {
                            if (isPlaying) {
                                video.pause();
                                setIsPlaying(false);
                            } else {
                                video.play();
                                setIsPlaying(true);
                            }
                        }
                    }}
                >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
            }
        </div>
    );
}

// memo VideoControl
export default memo(VideoControl);
