import * as React from "react";
import {
    Player as ShakaPlayer,
    ui as ShakaUI,
} from "shaka-player/dist/shaka-player.ui.debug";
import usePlayerStore from "../store";
import shallow from "zustand/shallow";

import { ReactShakaPlayer } from "./player";
import PlayerOverlay from "./PlayerOverlay";
import styles from "./styles";
const manifestUri = "https://delta43tatasky.akamaized.net/out/i/1197.mpd";

export default function MainPlayer() {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [player, setPlayer] = React.useState<ShakaPlayer | null>(null);
    const [buffering, setBuffering] = usePlayerStore(
        (state: any) => [state.isBuffering, state.setIsBuffering],
        shallow
    );

    React.useEffect(() => {
        new Promise(async (resolve, reject) => {
            if (videoRef && videoRef.current !== null) {
                const mainPlayer = new ShakaPlayer(videoRef.current);

                setBuffering(true);
                await mainPlayer.load(
                    "https://assetshuluimcom-a.akamaihd.net/prerolls/16x9/ma/R_kp95.mp4"
                );

                setPlayer(mainPlayer);
                setBuffering(false);

                videoRef.current.onended = async () => {
                    setBuffering(true);

                    mainPlayer.configure({
                        drm: {
                            clearKeys: {
                                "79a369ad99ec46539fe1e1d9dcd55a06:":
                                    "6912a1f2c8c210beb298679008e9256d",
                            },
                        },
                        manifest: {
                            dash: {
                                ignoreMinBufferTime: true,
                            },
                        },
                    });

                    await mainPlayer.load(manifestUri);
                    setBuffering(false);
                    videoRef.current.play();
                };

                videoRef.current?.play();
                videoRef.current.muted = true;
                setBuffering(false);

                mainPlayer.addEventListener("buffering", () => {
                    setBuffering(mainPlayer.isBuffering());
                });
            }
        });

        return async () => {
            if (player) {
                player.unload();
                await player.destroy();
                videoRef.current?.remove();
            }

            if (videoRef && videoRef.current) {
                videoRef.current.onended = null;
            }

            setPlayer(null);
            setBuffering(false);
            return;
        };
    }, [videoRef]);

    return (
        <div style={styles.mainPlayer}>
            <PlayerOverlay player={player} video={videoRef.current} />
            <ReactShakaPlayer uiContainerRef={videoRef} />
        </div>
    );
}
