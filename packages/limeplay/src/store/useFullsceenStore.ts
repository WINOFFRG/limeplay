import { StateCreator } from 'zustand';
import { PlayerSkinStore } from './usePlayerSkinStore';

export interface FullscreenStore {
	fullscreen: boolean;
	toggleFullscreen: () => void;
}

export const createFullscreenStore: StateCreator<
	FullscreenStore & PlayerSkinStore,
	[],
	[],
	FullscreenStore
> = (set) => ({
	fullscreen: false,
	toggleFullscreen: () =>
		set((state) => ({
			fullscreen: !state.fullscreen,
			idle: false,
		})),
});
