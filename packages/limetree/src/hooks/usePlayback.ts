import { useCallback, useEffect, useRef, useState } from 'react';
import { StateCreator } from 'zustand';
import { useLimeplayStore, useLimeplayStoreAPI } from '../store';

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

interface UsePlaybackConfig {
	events: Array<keyof HTMLMediaElementEventMap>;
}

export default function usePlayback(): UsePlaybackResult {
	const playback = useLimeplayStore((state) => state.playback);
	// const setIsPlaying = useLimeplayStore((state) => state.setIsPlaying);
	const { setIsPlaying } = useLimeplayStoreAPI().getState();
	const setTogglePlayback = useLimeplayStore(
		(state) => state.setTogglePlayback
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

		const events: Array<keyof HTMLMediaElementEventMap> = [
			'play',
			'pause',
			'playing',
			'waiting',
			'seeking',
			'seeked',
		];

		events.forEach((event) => {
			playback.addEventListener(event, playbackEventHandler);
		});

		playbackEventHandler();
		setTogglePlayback(togglePlayback);

		return () => {
			if (playback) {
				events.forEach((event) => {
					playback.removeEventListener(event, playbackEventHandler);
				});
			}
		};
	}, [playback]);

	return { togglePlayback, setPlayback } as UsePlaybackResult;
}
