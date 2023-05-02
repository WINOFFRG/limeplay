import { useEffect } from 'react';
import { StateCreator } from 'zustand';
import { useLimeplayStore, useLimeplayStoreAPI } from '../store';

export interface UseVolumeConfig {
	/**
	 * HTMLMediaElement events to listen to
	 * @default Events - ['volumechange']
	 */
	events?: HTMLMediaElementEvents;

	initialVolume?: number;

	syncMuteState?: boolean;
}

export interface VolumeSlice {
	volume: number;
	_setVolume: (volume: number) => void;
	muted: boolean;
	_setMuted: (muted: boolean) => void;
	lastVolume: number;
	_setLastVolume: (lastVolume: number) => void;
}

export function useVolume({
	initialVolume = 1,
	events,
	syncMuteState = true,
}: UseVolumeConfig = {}) {
	const { getState } = useLimeplayStoreAPI();
	const playback = useLimeplayStore((state) => state.playback);
	const setVolume = useLimeplayStore((state) => state._setVolume);
	const setMuted = useLimeplayStore((state) => state._setMuted);
	const setLastVolume = useLimeplayStore((state) => state._setLastVolume);

	useEffect(() => {
		const volumeEventHandler = () => {
			if (syncMuteState) {
				if (playback.muted !== getState().muted) {
					setMuted(playback.muted);

					if (playback.muted === true) {
						setVolume(0);
					} else {
						setVolume(getState().lastVolume);
					}
				} else if (playback.muted === true && playback.volume > 0) {
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
				if (playback.muted !== getState().muted) {
					setMuted(playback.muted);

					if (playback.muted === false && getState().volume === 0) {
						setVolume(getState().lastVolume);
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

		const hookEvents: HTMLMediaElementEvents = events || ['volumechange'];

		hookEvents.forEach((event) => {
			playback.addEventListener(event, volumeEventHandler);
		});

		playback.volume = playback.muted ? 0 : initialVolume || playback.volume;

		volumeEventHandler();

		return () => {
			if (playback) {
				hookEvents.forEach((event) => {
					playback.removeEventListener(event, volumeEventHandler);
				});
			}
		};
	}, [playback, events, syncMuteState, initialVolume]);
}

const hookName = '@limeplay/hooks/useVolume';
useVolume.displayName = hookName;

export const createVolumeSlice: StateCreator<VolumeSlice> = (set) => ({
	volume: 0,
	_setVolume: (volume: number) => set({ volume }),
	muted: false,
	_setMuted: (muted: boolean) => set({ muted }),
	lastVolume: 1,
	_setLastVolume: (lastVolume: number) => set({ lastVolume }),
});
