import { useEffect } from 'react';
import { StateCreator } from 'zustand';
import { useLimeplayStore } from '../store';
import hookDefaultValue from './utils/default-value';

export interface UsePlaybackConfig {
	/**
	 * HTMLMediaElement events to listen to
	 * @default Events - ['play', 'pause', 'waiting', 'seeking', 'seeked']
	 */
	events?: HTMLMediaElementEvents;
}

export function usePlayback({ events }: UsePlaybackConfig = {}) {
	const playback = useLimeplayStore((state) => state.playback);
	const setIsPlaying = useLimeplayStore((state) => state._setIsPlaying);
	const setTogglePlayback = useLimeplayStore(
		(state) => state._setTogglePlayback
	);

	const togglePlayback = () => {
		if (playback.paused) playback.play();
		else playback.pause();
	};

	useEffect(() => {
		const playbackEventHandler = (e) => {
			console.log('Playback Event', e?.type);
			setIsPlaying(!playback.paused);
		};

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

const hookName = 'usePlayback';

export interface PlaybackSlice {
	isPlaying: boolean;
	_setIsPlaying: (isPlaying: boolean) => void;
	togglePlayback: () => void;

	/**
	 * Set a function that toggles the playback state.
	 * @param toggleFn - A function that toggles the playback state.
	 * @memberof PlaybackSlice
	 */
	_setTogglePlayback: (toggleFn: () => void) => void;
}

export const createPlaybackSlice: StateCreator<PlaybackSlice> = (set) => ({
	isPlaying: false,
	_setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
	togglePlayback: hookDefaultValue(hookName),
	_setTogglePlayback: (toggleFn: () => void) =>
		set({ togglePlayback: toggleFn }),
});
