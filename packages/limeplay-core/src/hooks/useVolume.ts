import { useCallback, useEffect, useRef, useState } from 'react';
import { clamp } from 'lodash';
import { useStateRef } from '../utils';
import { useLimeplay } from '../components';

export interface UseVolumeConfig {
	/**
	 * HTMLMediaElement events to listen to
	 * @default Events - ['volumechange']
	 */
	initialVolume?: number;
	syncMuteState?: boolean;
}

export function useVolume({
	initialVolume, // Do not provide default value as playback.volume will be used
	syncMuteState = true,
}: UseVolumeConfig = {}) {
	const { playbackRef } = useLimeplay();
	const playback = playbackRef.current;
	const [volume, setVolume] = useState(initialVolume ?? playback.volume);
	const [muted, setMuted, mutedRef] = useStateRef(playback.muted);
	const [lastVolume, setLastVolume, lastVolumeRef] =
		useStateRef(initialVolume);

	const toggleMute = () => {
		playback.muted = !playback.muted;
	};

	const updateCurrentVolume = useCallback((vol: number) => {
		if (playback.readyState === 0 || Number.isNaN(vol)) return;
		vol = clamp(vol, 0, 1);
		playback.volume = vol;
	}, []);

	useEffect(() => {
		const volumeEventHandler = () => {
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

		const events = ['volumechange'];

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
	}, [syncMuteState]);

	return {
		volume,
		muted,
		lastVolume,
		toggleMute,
		updateCurrentVolume,
	} as const;
}
