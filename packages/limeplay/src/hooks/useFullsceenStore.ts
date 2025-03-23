import { StateCreator } from 'zustand';
import { PlayerRootStore } from './usePlayerRootStore';

export interface FullscreenStore {
	fullscreen: boolean;
	toggleFullscreen: () => void;
}

export const createFullscreenStore: StateCreator<
	FullscreenStore & PlayerRootStore,
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
