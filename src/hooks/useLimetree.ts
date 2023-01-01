import { useEffect, useState } from 'react';
import useStore from '../store';
import configure from './configure';
import shaka from 'shaka-player/dist/shaka-player.ui.debug';

export default function useLimetree() {
    const video: HTMLVideoElement = useStore((state) => state.video);
    const setPlayerConfig = useStore((state) => state.setPlayerConfig);
    const setShakaPlayer = useStore((state) => state.setShakaPlayer);
    const [isDestroyed, setIsDestroyed] = useState(true);

    useEffect(() => {
        if (!video || !isDestroyed) return;

        const mainPlayer = new shaka.Player(video);
        const configuration = configure(mainPlayer);
        mainPlayer.configure(configuration.shaka);

        setPlayerConfig(configuration);
        setShakaPlayer(mainPlayer);

        (async () => {
            await mainPlayer.load(configuration.playback.url);
        })();

        return () => {
            (async () => {
                if (!mainPlayer) return;
                setIsDestroyed(false);

                await mainPlayer.detach();
                await mainPlayer.destroy();

                setShakaPlayer(null);
                setPlayerConfig(null);
                setIsDestroyed(true);
            })();
        };
    }, [video, isDestroyed]);
}
