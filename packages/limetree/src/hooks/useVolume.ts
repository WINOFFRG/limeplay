import { useEffect, useState } from 'react';
import { StateCreator } from 'zustand';
import hookDefaultValue from './utils/default-value';

interface UseVolumeResult {
	volume: number;
	setVolume: (volume: number) => void;
	muted: boolean;
	lastVolume: number;
	toggleMute: () => void;
}

interface UseVolumeProps {
	initialVolume?: number;
}

export default function useVolume(
	playback: HTMLMediaElement,
	{ initialVolume }: UseVolumeProps
) {
	const [currentVolume, setCurrentVolume] = useState<number>(
		playback.muted ? 0 : initialVolume || playback.volume
	);
	const [lastVolume, setLastVolume] = useState<number>(
		currentVolume === 0 ? initialVolume || 1 : currentVolume
	);
	const [muted, setMuted] = useState<boolean>(
		playback.muted || currentVolume === 0
	);

	const setVolume = (volume: number) => {
		if (playback.muted) playback.muted = false;
		playback.volume = volume;
	};

	const toggleMute = () => {
		playback.muted = !playback.muted;
		playback.volume = playback.muted ? 0 : lastVolume;
	};

	useEffect(() => {
		const volumeEventHandler = () => {
			const { volume } = playback;
			setCurrentVolume(volume);
			setMuted(volume === 0 || playback.muted);
			if (volume > 0) setLastVolume(volume);
		};

		playback.addEventListener('volumechange', volumeEventHandler);
		playback.volume = currentVolume;

		volumeEventHandler();

		return () => {
			if (playback) {
				playback.removeEventListener(
					'volumechange',
					volumeEventHandler
				);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playback]); // Because currentVolume is set by events, we only need to set it initially
}

const hookName = 'useVolume';

export interface VolumeSlice {
	volume: number;
	_setVolume: (volume: number) => void;
	muted: boolean;
	_setMuted: (muted: boolean) => void;
	lastVolume: number;
	_setLastVolume: (lastVolume: number) => void;
	toggleMute: () => void;
	_setToggleMute: (toggleMute: () => void) => void;
}

export const createVolumeSlice: StateCreator<VolumeSlice> = (set) => ({
	volume: 0,
	_setVolume: (volume: number) => set({ volume }),
	// setVolume: hookDefaultValue(hookName),
	muted: false,
	_setMuted: (muted: boolean) => set({ muted }),
	lastVolume: 1,
	_setLastVolume: (lastVolume: number) => set({ lastVolume }),
	toggleMute: hookDefaultValue(hookName),
	_setToggleMute: (toggleMute: () => void) => set({ toggleMute }),
});
