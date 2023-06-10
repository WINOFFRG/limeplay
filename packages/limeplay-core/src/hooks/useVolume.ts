import { useCallback, useEffect, useRef, useState } from 'react';
import { useStateRef } from '../utils';

export interface UseVolumeConfig {
	/**
	 * HTMLMediaElement events to listen to
	 * @default Events - ['volumechange']
	 */
	events?: HTMLMediaElementEvents;

	initialVolume?: number;

	syncMuteState?: boolean;

	playback?: HTMLMediaElement;

	disabled?: boolean;
}

export function useVolume({
	initialVolume = 1,
	events = ['volumechange'],
	playback,
	disabled,
	syncMuteState = true,
}: UseVolumeConfig = {}) {
	const [volume, setVolume, volumeRef] = useStateRef(initialVolume);
	const [muted, setMuted, mutedRef] = useStateRef(playback.muted);
	const [lastVolume, setLastVolume, lastVolumeRef] =
		useStateRef(initialVolume);

	const toggleMute = () => {
		if (disabled) return;
		playback.muted = !playback.muted;
	};

	useEffect(() => {
		const volumeEventHandler = () => {
			if (disabled) return;

			if (syncMuteState) {
				// Volume Toggle Case - Muted
				if (playback.muted !== mutedRef.current) {
					setMuted(playback.muted);

					if (playback.muted === true) {
						setVolume(0);
					} else {
						setVolume(lastVolumeRef.current);
					}
				}
				// Volume Slide Change Case
				else if (playback.muted === true && playback.volume > 0) {
					playback.muted = false;
					setMuted(false);
					setVolume(playback.volume);
				} else if (playback.volume === 0) {
					playback.muted = true;
					setMuted(true);
					setVolume(playback.volume);
				} else {
					setVolume(playback.volume);
				}
			} else if (!syncMuteState) {
				if (playback.muted !== mutedRef.current) {
					setMuted(playback.muted);

					if (playback.muted === false && playback.volume === 0) {
						setVolume(lastVolumeRef.current);
					}
				} else {
					setVolume(playback.volume);

					if (playback.volume === 0) {
						setMuted(true);
					}
				}
			}

			if (playback.volume > 0) {
				setLastVolume(playback.volume);
			}
		};

		events.forEach((event) => {
			playback.addEventListener(event, volumeEventHandler);
		});

		return () => {
			if (playback) {
				events.forEach((event) => {
					playback.removeEventListener(event, volumeEventHandler);
				});
			}
		};
	}, [playback, events, syncMuteState, events]);

	useEffect(() => {
		playback.volume = playback.muted ? 0 : initialVolume || playback.volume;
	}, [initialVolume, playback]);

	return {
		volume,
		muted,
		lastVolume,
		toggleMute,
	};
}
