import { useEffect, useState } from 'react';
import { StateCreator } from 'zustand';
import { useGesture, EventTypes, Handler } from '@use-gesture/react';
import { clamp } from 'lodash';
import hookDefaultValue from './utils/default-value';
import { useLimeplayStore } from '../store';

export interface UseVolumeConfig {
	/**
	 * HTMLMediaElement events to listen to
	 * @default Events - ['volumechange']
	 */
	events?: HTMLMediaElementEvents;

	initialVolume?: number;
}

export interface VolumeSlice {
	isVolumeHookInjected: boolean;
	setIsVolumeHookInjected: (isVolumeHookInjected: boolean) => void;
	volume: number;
	_setVolume: (volume: number) => void;
	muted: boolean;
	_setMuted: (muted: boolean) => void;
	lastVolume: number;
	_setLastVolume: (lastVolume: number) => void;
}

export function useVolume({ initialVolume = 1, events }: UseVolumeConfig = {}) {
	const playback = useLimeplayStore((state) => state.playback);
	const setVolume = useLimeplayStore((state) => state._setVolume);
	const setMuted = useLimeplayStore((state) => state._setMuted);
	const setIsVolumeHookInjected = useLimeplayStore(
		(state) => state.setIsVolumeHookInjected
	);

	useEffect(() => {
		const volumeEventHandler = () => {
			const { volume } = playback;
			setVolume(volume);

			if (volume === 0 || playback.muted) {
				setMuted(true);
			} else if (volume > 0 || !playback.muted) {
				setMuted(false);
			}
		};

		const hookEvents: HTMLMediaElementEvents = events || ['volumechange'];

		hookEvents.forEach((event) => {
			playback.addEventListener(event, volumeEventHandler);
		});

		playback.volume = playback.muted ? 0 : initialVolume || playback.volume;

		volumeEventHandler();

		setIsVolumeHookInjected(true);

		return () => {
			if (playback) {
				hookEvents.forEach((event) => {
					playback.removeEventListener(event, volumeEventHandler);
				});
			}
		};
	}, [playback]);
}

const hookName = '@limeplay/hooks/useVolume';
useVolume.displayName = hookName;

export const createVolumeSlice: StateCreator<VolumeSlice> = (set) => ({
	isVolumeHookInjected: false,
	setIsVolumeHookInjected: (isVolumeHookInjected: boolean) =>
		set({ isVolumeHookInjected }),
	volume: 0,
	_setVolume: (volume: number) => set({ volume }),
	muted: false,
	_setMuted: (muted: boolean) => set({ muted }),
	lastVolume: 1,
	_setLastVolume: (lastVolume: number) => set({ lastVolume }),
});
