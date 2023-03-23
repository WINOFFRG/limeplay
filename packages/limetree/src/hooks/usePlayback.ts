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

export interface PlaybackSlice {
	isPlaybackHookInjected: boolean;
	_setIsPlaybackHookInjected: (isPlaybackHookInjected: boolean) => void;
	isPlaying: boolean;
	_setIsPlaying: (isPlaying: boolean) => void;
}

export function usePlayback({ events }: UsePlaybackConfig = {}) {
	const playback = useLimeplayStore((state) => state.playback);
	const setIsPlaying = useLimeplayStore((state) => state._setIsPlaying);
	const setIsPlaybackHookInjected = useLimeplayStore(
		(state) => state._setIsPlaybackHookInjected
	);

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
		setIsPlaybackHookInjected(true);

		return () => {
			if (playback) {
				hookEvents.forEach((event) => {
					playback.removeEventListener(event, playbackEventHandler);
				});
			}
		};
	}, [playback, events]);
}

const hookName = '@limeplay/hooks/usePlayback';
usePlayback.displayName = hookName;

export const createPlaybackSlice: StateCreator<PlaybackSlice> = (set) => ({
	isPlaybackHookInjected: false,
	_setIsPlaybackHookInjected: (isPlaybackHookInjected: boolean) =>
		set({ isPlaybackHookInjected }),
	isPlaying: false,
	_setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
});
