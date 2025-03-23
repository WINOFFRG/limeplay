import { createRef } from 'react';
import { create } from 'zustand';
import shaka from 'shaka-player';
import { useFullScreen, useOrientation } from '@limeplay/core';

type UseOrientationType = ReturnType<typeof useOrientation>;
type UseFullScreenType = ReturnType<typeof useFullScreen>;

interface StoreState {
	playback: React.RefObject<HTMLMediaElement>;
	player: shaka.Player;
	setPlayback: (playback: React.RefObject<HTMLMediaElement>) => void;
	setPlayer: (player: shaka.Player) => void;
	lockOrientation: UseOrientationType['lockOrientation'] | null;
	unlockOrientation: UseOrientationType['unlockOrientation'] | null;
	_setLockOrientation: (
		lockOrientation: UseOrientationType['lockOrientation']
	) => void;
	_setUnlockOrientation: (
		unlockOrientation: UseOrientationType['unlockOrientation']
	) => void;
	enterFullScreen: UseFullScreenType['enterFullScreen'] | null;
	exitFullScreen: UseFullScreenType['exitFullScreen'] | null;
	_setEnterFullScreen: (
		enterFullScreen: UseFullScreenType['enterFullScreen']
	) => void;
	_setExitFullScreen: (
		exitFullScreen: UseFullScreenType['exitFullScreen']
	) => void;
}

const useAppStore = create<StoreState>()((set) => ({
	playback: createRef<HTMLMediaElement>(),
	player: new shaka.Player(),
	setPlayback: (playback) => set({ playback }),
	setPlayer: (player) => set({ player }),
	lockOrientation: null,
	unlockOrientation: null,
	_setLockOrientation: (lockOrientation) => set({ lockOrientation }),
	_setUnlockOrientation: (unlockOrientation) => set({ unlockOrientation }),
	enterFullScreen: null,
	exitFullScreen: null,
	_setEnterFullScreen: (enterFullScreen) => set({ enterFullScreen }),
	_setExitFullScreen: (exitFullScreen) => set({ exitFullScreen }),
}));

export default useAppStore;
