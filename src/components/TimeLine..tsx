import { useEffect } from "react";
import usePlayerStore from "../store";
import {
    Player,
    Player as ShakaPlayer,
    ui as ShakaUI,
    util as ShakaUtils,
} from "shaka-player/dist/shaka-player.ui.debug";
import { utils } from "./utils";
import styles from "./styles";
import LiveIcon from "./LiveIcon";
import shallow from "zustand/shallow";

export default function TimeLine({
    player,
    video,
}: {
    player: ShakaPlayer | null;
    video: HTMLVideoElement | null;
}) {
    const [playerTimer, setPlayerTimer] = usePlayerStore(
        (state: any) => [state.playerTimer, state.setPlayerTimer],
        shallow
    );

    const [liveVideoDelay, setLiveVideoDelay] = usePlayerStore(
        (state: any) => [state.liveVideoDelay, state.setLiveVideoDelay],
        shallow
    );

    function getTotalTime() {
        const duration = video.duration;
        const showHour = duration >= 3600;
        const displayTime = utils.buildTimeString(duration, showHour);
        return displayTime;
    }

    useEffect(() => {
        const videoTimer = new ShakaUtils.Timer(() => {
            if (video && player) {
                let displayTime = video.currentTime;
                const seekRange = player.seekRange();
                const behindLive = Math.floor(seekRange.end - displayTime);
                displayTime = Math.max(0, behindLive);
                setLiveVideoDelay(displayTime);
                console.log({ displayTime });
            }
        });

        videoTimer.tickEvery(1);
        setPlayerTimer(videoTimer);

        return () => {
            videoTimer.stop();
            setPlayerTimer(null);
        };
    }, []);

    return (
        <>
            {player.isLive() && (
                <button
                    style={styles.liveIcon}
                    onClick={() => {
                        player.goToLive();
                    }}
                >
                    <div className="live-control">
                        <LiveIcon state={liveVideoDelay < 3} />
                    </div>
                </button>
            )}
            <div style={styles.timeIcon}>
                {"-" + utils.buildTimeString(liveVideoDelay, false)}{" "}
                <div>/</div>
                {player.isLive() ? "Infinity" : <div>{getTotalTime()}</div>}
            </div>
        </>
    );
}
