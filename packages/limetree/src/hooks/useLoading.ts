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

export default function useVolume(player) {
	return {};
}
