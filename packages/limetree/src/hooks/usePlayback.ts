import { useEffect } from 'react';
import { StateCreator } from 'zustand';
import { useLimeplayStore } from '../store';

export interface UsePlaybackConfig {
	/**
	 * HTMLMediaElement events to listen to
	 * @default Events - ['play', 'pause', 'waiting', 'seeking', 'seeked']
	 */
	events?: HTMLMediaElementEvents;
}

export function usePlayback({ events }: UsePlaybackConfig = {}) {
	const playback = useLimeplayStore((state) => state.playback);
	const setIsPlaying = useLimeplayStore((state) => state.setIsPlaying);
	const setTogglePlayback = useLimeplayStore(
		(state) => state._setTogglePlayback
	);

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

		const hookEvents: HTMLMediaElementEvents = events || [
			'play',
			'pause',
			'waiting',
			'seeking',
			'seeked',
		];

		hookEvents.forEach((event) => {
			playback.addEventListener(event, playbackEventHandler);
		});

		playbackEventHandler();
		setTogglePlayback(togglePlayback);

		return () => {
			if (playback) {
				hookEvents.forEach((event) => {
					playback.removeEventListener(event, playbackEventHandler);
				});
			}
		};
	}, [playback]);
}

function defaultFunction() {
	console.error(
		'usePlaybackHook must be mounted before accessing its values'
	);
}

export interface PlaybackSlice {
	isPlaying: boolean;
	setIsPlaying: (isPlaying: boolean) => void;
	togglePlayback: () => void;

	/**
	 * Set a function that toggles the playback state.
	 * @param toggleFn - A function that toggles the playback state.
	 * @memberof PlaybackSlice
	 */
	_setTogglePlayback: (toggleFn: () => void) => void;

	/**
	 *
	 * @param state - The state to set the playback to.
	 * @returns void
	 */
	setPlayback: (state: boolean) => void;

	/**
	 * Set a function that sets the playback state.
	 * @param setPlayback - A function that sets the playback state.
	 */
	_setSetPlayback: (setPlayback: (state: boolean) => void) => void;
}

export const createPlaybackSlice: StateCreator<PlaybackSlice> = (set) => ({
	isPlaying: false,
	setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
	togglePlayback: defaultFunction,
	_setTogglePlayback: (toggleFn: () => void) =>
		set({ togglePlayback: toggleFn }),
	setPlayback: defaultFunction,
	_setSetPlayback: (setPlayback: (state: boolean) => void) =>
		set({ setPlayback }),
});
