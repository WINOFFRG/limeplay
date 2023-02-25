import { useEffect, useState } from 'react';

interface UsePlaybackResult {
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
	playback: HTMLMediaElement
): UsePlaybackResult {
	const [isPlaying, setIsPlaying] = useState<boolean>(playback.paused);

	const togglePlayback = () => {
		if (playback.paused) playback.play();
		else playback.pause();
	};

	const setPlayback = (state: boolean) => {
		if (state) playback.play();
		else playback.pause();
	};

	useEffect(() => {
		const playbackEventHandler = () => setIsPlaying(!playback.paused);

		playback.addEventListener('play', playbackEventHandler);
		playback.addEventListener('pause', playbackEventHandler);
		playback.addEventListener('playing', playbackEventHandler);
		playback.addEventListener('waiting', playbackEventHandler);
		playback.addEventListener('seeking', playbackEventHandler);
		playback.addEventListener('seeked', playbackEventHandler);

		playbackEventHandler();

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

	return { isPlaying, togglePlayback, setPlayback } as UsePlaybackResult;
}
