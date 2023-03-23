import { useEffect, useState } from 'react';
import { StateCreator } from 'zustand';
import { useGesture } from '@use-gesture/react';
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
	bindVolumeEvents: ReturnType<typeof useGesture>;
	_setBindVolumeEvents: (
		bindVolumeEvents: ReturnType<typeof useGesture>
	) => void;
}

export function useVolume({ initialVolume, events }: UseVolumeConfig = {}) {
	const playback = useLimeplayStore((state) => state.playback);
	const setVolume = useLimeplayStore((state) => state._setVolume);
	const setMuted = useLimeplayStore((state) => state._setMuted);
	const setLastVolume = useLimeplayStore((state) => state._setLastVolume);
	const setIsVolumeHookInjected = useLimeplayStore(
		(state) => state.setIsVolumeHookInjected
	);
	const setBindVolumeEvents = useLimeplayStore(
		(state) => state._setBindVolumeEvents
	);

	const bindVolumeEvents = useGesture({
		onDrag: ({ movement: [x] }) => {
			const volume = x / 100;
			playback.volume = volume > 1 ? 1 : volume < 0 ? 0 : volume;
		},
	});

	useEffect(() => {
		const volumeEventHandler = () => {
			const { volume } = playback;
			setVolume(volume);
			setMuted(volume === 0 || playback.muted);
			if (volume > 0) setLastVolume(volume);
		};

		const hookEvents: HTMLMediaElementEvents = events || ['volumechange'];

		hookEvents.forEach((event) => {
			playback.addEventListener(event, volumeEventHandler);
		});

		playback.volume = playback.muted ? 0 : initialVolume || playback.volume;

		volumeEventHandler();
		setBindVolumeEvents(bindVolumeEvents);

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
	bindVolumeEvents: hookDefaultValue(hookName),
	_setBindVolumeEvents: (bindVolumeEvents: ReturnType<typeof useGesture>) =>
		set({ bindVolumeEvents }),
});
