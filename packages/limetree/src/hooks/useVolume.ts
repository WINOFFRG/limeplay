import { useEffect, useState } from 'react';

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
): UseVolumeResult {
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

		if (playback.muted) playback.volume = 0;
		volumeEventHandler();

		return () => {
			if (playback) {
				playback.removeEventListener(
					'volumechange',
					volumeEventHandler
				);
			}
		};
	}, [playback]);

	return {
		volume: currentVolume,
		setVolume,
		muted,
		lastVolume,
		toggleMute,
	} as const;
}
