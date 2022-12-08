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
const licenseUrl = "";

export default function MainPlayer() {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const setBuffering = usePlayerStore((state: any) => state.setIsBuffering);
    const player = usePlayerStore((state: any) => state.player);
    const setPlayer = usePlayerStore((state: any) => state.setPlayer);

    React.useEffect(() => {
        new Promise(async (resolve, reject) => {
            if (videoRef && videoRef.current !== null) {
                const mainPlayer = new ShakaPlayer(videoRef.current);
                console.log("Attached New Player");
                window.player = mainPlayer;

                await mainPlayer.load(
                    "https://assetshuluimcom-a.akamaihd.net/prerolls/16x9/ma/R_kp95.mp4"
                );

                setPlayer(mainPlayer);

                videoRef.current.onended = async () => {
                    mainPlayer.configure({
                        drm: {
                            clearKeys: {
                                b258fdb6dc054f04bcdb200cee3ef6da:
                                    "017f465f4d9d82dc1ff632dd4a3c94f2",
                            },
                            // servers: {
                            //     "com.widevine.alpha": licenseUrl,
                            // },
                        },
                        manifest: {
                            dash: {
                                ignoreMinBufferTime: true,
                            },
                        },
                    });

                    await mainPlayer.load(manifestUri);
                    videoRef.current.play();
                };

                videoRef.current?.play();

                mainPlayer.addEventListener("buffering", () => {
                    setBuffering(mainPlayer.isBuffering());
                });

                resolve(mainPlayer);
            }

            return () => {
                new Promise(async (resolve, reject) => {
                    if (!!videoRef.current) {
                        videoRef.current?.pause();
                        videoRef.current.onended = null;
                        videoRef.current.remove();
                    }

                    if (player) {
                        console.log(
                            "%c Destroying Player",
                            "background: black; color: green"
                        );

                        console.log(player?.detach(), "detach");
                        console.log(player?.unload(), "unload");
                        console.log(player?.destroy(), "destroy");
                        setPlayer(null);
                    } else {
                        console.log(
                            "%c Player is Null",
                            "background: black; color: red"
                        );
                    }

                    resolve(true);
                });
            };
        });
    }, [videoRef]);

    return (
        <div style={styles.mainPlayer}>
            <PlayerOverlay player={player} video={videoRef.current} />
            <ReactShakaPlayer uiContainerRef={videoRef} />
        </div>
    );
}
