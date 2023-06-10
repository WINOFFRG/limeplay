import { useEffect, useState } from 'react';

export interface UsePlaybackConfig {
	/**
	 * HTMLMediaElement events to listen to
	 * @default Events - ['play', 'pause', 'waiting', 'seeking', 'seeked']
	 */
	events?: HTMLMediaElementEvents;

	playback?: HTMLMediaElement;

	disabled?: boolean;
}

export function usePlayback({
	playback,
	disabled,
	events = ['play', 'pause', 'waiting', 'seeking', 'seeked'],
}: UsePlaybackConfig) {
	const [isPlaying, setIsPlaying] = useState(false);

	const togglePlayback = () => {
		if (!playback.duration || disabled) return;

		if (playback.paused) playback.play();
		else playback.pause();
	};

	useEffect(() => {
		const playbackEventHandler = () => setIsPlaying(!playback.paused);

		events.forEach((event) => {
			playback.addEventListener(event, playbackEventHandler);
		});

		playbackEventHandler();

		return () => {
			if (playback) {
				events.forEach((event) => {
					playback.removeEventListener(event, playbackEventHandler);
				});
			}
		};
	}, [playback, events]);

	return {
		isPlaying,
		togglePlayback,
	};
}
