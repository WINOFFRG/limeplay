import * as React from "react";
import {
    Player,
    Player as ShakaPlayer,
    ui as ShakaUI,
    util as ShakaUtils,
} from "shaka-player/dist/shaka-player.ui.debug";
import shallow from "zustand/shallow";
import usePlayerStore from "../store";
// import usePlayerStore from "../store";
import BufferingLogo from "./BufferingLogo";
import LiveIcon from "./LiveIcon";
import styles from "./styles";
import TimeLine from "./TimeLine.";
import { utils } from "./utils";
import VideoControl from "./VideoControl";

export default function PlayerOverlay({
    player,
    video,
}: {
    player: ShakaPlayer | null;
    video: HTMLVideoElement | null;
}) {
    const [trackText, setTrackText] = React.useState("Select Best Track");
    const [currentTime, setCurrentTime] = React.useState("00:00");

    const [isPlaying, setIsPlaying] = usePlayerStore(
        (state: any) => [state.playing, state.setPlaying],
        shallow
    );

    const [buffering, setBuffering] = usePlayerStore(
        (state: any) => [state.isBuffering, state.setIsBuffering],
        shallow
    );

    React.useEffect(() => {
        if (video) {
            const isVideoPlaying = () => {
                return !!(
                    video.currentTime > 0 &&
                    !video.paused &&
                    !video.ended &&
                    video.readyState > 2
                );
            };

            video.addEventListener("playing", () => {
                setIsPlaying(true);
            });

            video.addEventListener("pause", () => {
                setIsPlaying(false);
            });

            setIsPlaying(isVideoPlaying());
            // updateCurrentTime();

            return () => {
                // remove event listener on mouse move
                window.removeEventListener("mousemove", () => {});
                video.removeEventListener("playing", () => {});
                video.removeEventListener("pause", () => {});
            };
        }
    }, []);

    function selectTrack(track: any) {
        player?.configure({
            abr: {
                enabled: false,
            },
        });

        player?.selectVariantTrack(track, true);
    }

    if (!player || !video) {
        return null;
    }

    return (
        <div style={styles.playerOverlay}>
            <div style={styles.playerOverlayWrapper}>
                <VideoControl video={video} />
                <button
                    disabled={trackText !== "Select Best Track"}
                    onClick={() => {
                        const bestTrack = utils.getBestTrack(player);
                        const trackText = `${bestTrack.width} x ${bestTrack.height}`;
                        setTrackText(trackText);
                        selectTrack(bestTrack);
                    }}
                >
                    {trackText}
                </button>
                <TimeLine video={video} player={player} />
            </div>
            {buffering && <BufferingLogo />}
        </div>
    );
}
