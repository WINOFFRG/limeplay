import * as React from "react";
import {
    Player,
    Player as ShakaPlayer,
    ui as ShakaUI,
    util as ShakaUtils,
} from "shaka-player/dist/shaka-player.ui.debug";
import usePlayerStore from "../store";
import BufferingLogo from "./BufferingLogo";
import LiveIcon from "./LiveIcon";
import PauseIcon from "./PauseIcon";
import PlayIcon from "./PlayIcon";
import styles from "./styles";
import TimeLine from "./TimeLine.";
import { utils } from "./utils";

export default function PlayerOverlay({
    player,
    video,
}: {
    player: ShakaPlayer | null;
    video: HTMLVideoElement | null;
}) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [trackText, setTrackText] = React.useState("Select Best Track");
    const [currentTime, setCurrentTime] = React.useState("00:00");

    const [buffering, setBuffering] = usePlayerStore((state: any) => [
        state.isBuffering,
        state.setIsBuffering,
    ]);

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
