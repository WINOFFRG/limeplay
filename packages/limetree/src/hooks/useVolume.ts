import { useCallback, useEffect, useState } from 'react';

interface UseVolumeResult {}

interface UseVolumeProps {}

export default function useVolume(playback: HTMLMediaElement | null) {
    const [currentVolume, setCurrentVolume] = useState<number>(
        playback?.muted ? 0 : playback?.volume || 0
    );
    const [lastVolume, setLastVolume] = useState<number>(currentVolume);
    const [muted, setMuted] = useState<boolean>(playback?.muted || false);

    const volumeEventHandler = useCallback(() => {
        if (playback) {
            const volume = playback.volume;
            console.log('Volume changed', volume);
            setCurrentVolume(volume);
            setMuted(volume === 0 || playback.muted);
            if (volume > 0) {
                console.log('Setting last volume', volume);
                setLastVolume(volume);
            }
        }
    }, [playback, setLastVolume, setCurrentVolume, setMuted]);

    const setVolume = useCallback(
        (volume: number) => {
            if (playback) {
                if (playback.muted) playback.muted = false;
                playback.volume = volume;
            }
        },
        [playback]
    );

    const toggleMute = useCallback(() => {
        if (playback) {
            console.log('Toggling mute', playback.muted);
            playback.muted = playback.muted ? false : true;
            console.log('Toggling mute 2', playback.muted);
            setVolume(playback.muted ? 0 : lastVolume);
        }
    }, [playback, lastVolume, setVolume]);

    useEffect(() => {
        if (playback) {
            playback.addEventListener('volumechange', volumeEventHandler);
            if (playback.muted) {
                console.log('intial muted');
                setVolume(0);
            }
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
