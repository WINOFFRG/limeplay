import { useCallback, useEffect, useState } from 'react';

interface PlaybackControls {
    /**
     * The current playback state of the track.
     * @returns true if the track is playing, false otherwise.
     */
    isPlaying: boolean;

    /**
     * Toggles the playback state of the track.
     */
    togglePlayback: () => void;

    /**
     * Sets the playback state of the track.
     * @param state The state to set the track to.
     */
    setPlayback: (state: boolean) => void;
}

export default function usePlayback(
    playback: HTMLMediaElement | null
): PlaybackControls {
    const [isPlaying, setIsPlaying] = useState<boolean>(
        playback?.paused || false
    );

    const playbackEventHandler = useCallback(() => {
        if (playback) setIsPlaying(!playback.paused);
    }, [playback, isPlaying]);

    const togglePlayback = useCallback(() => {
        if (playback) {
            if (playback.paused) playback.play();
            else playback.pause();
        }
    }, [playback]);

    const setPlayback = useCallback(
        (state: boolean) => {
            if (playback) {
                if (state) playback.play();
                else playback.pause();
            }
        },
        [togglePlayback]
    );

    useEffect(() => {
        if (playback) {
            playback.addEventListener('play', playbackEventHandler);
            playback.addEventListener('pause', playbackEventHandler);
            playback.addEventListener('playing', playbackEventHandler);
            playback.addEventListener('waiting', playbackEventHandler);
            playback.addEventListener('seeking', playbackEventHandler);
            playback.addEventListener('seeked', playbackEventHandler);
            playbackEventHandler();
        } else {
            setIsPlaying(false);
        }

        return () => {
            if (playback) {
                playback.removeEventListener('play', playbackEventHandler);
                playback.removeEventListener('pause', playbackEventHandler);
                playback.removeEventListener('playing', playbackEventHandler);
                playback.removeEventListener('waiting', playbackEventHandler);
                playback.removeEventListener('seeking', playbackEventHandler);
                playback.removeEventListener('seeked', playbackEventHandler);
            }
        };
    }, [playback]);

    return { isPlaying, togglePlayback, setPlayback } as const;
}
