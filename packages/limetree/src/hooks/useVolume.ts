import { useCallback, useEffect, useState } from 'react';

interface UseVolumeResult {}

interface UseVolumeProps {}

export default function useVolume(playback: HTMLMediaElement | null) {
    const [currentVolume, setCurrentVolume] = useState<number>(
        playback?.muted ? 0 : playback?.volume || 0
    );
    const [lastVolume, setLastVolume] = useState<number>(
        currentVolume === 0 ? 1 : currentVolume
    );
    const [muted, setMuted] = useState<boolean>(playback?.muted || false);

    const volumeEventHandler = useCallback(() => {
        if (playback) {
            const volume = playback.volume;
            setCurrentVolume(volume);
            setMuted(volume === 0 || playback.muted);
            if (volume > 0) setLastVolume(volume);
        }
    }, [playback, setLastVolume, setCurrentVolume, setMuted]);

    const setVolume = useCallback(
        (volume: number) => {
            if (playback) playback.volume = volume;
        },
        [playback]
    );

    const toggleMute = useCallback(() => {
        if (playback) {
            playback.muted = playback.muted ? false : true;
            setVolume(playback.muted ? 0 : lastVolume);
        }
    }, [playback, lastVolume, setVolume]);

    useEffect(() => {
        if (playback) {
            playback.addEventListener('volumechange', volumeEventHandler);
            if (playback.muted) setVolume(0);
            volumeEventHandler();
        }

        return () => {
            if (playback) {
                playback.removeEventListener(
                    'volumechange',
                    volumeEventHandler
                );
            }
        };
    }, [playback]);

    return {
        volume: currentVolume,
        setVolume,
        muted,
        toggleMute,
    };
}
