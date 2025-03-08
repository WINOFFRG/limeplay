import { StateCreator } from 'zustand';
import { PlayerSkinStore } from './usePlayerSkinStore';

export interface PipStore {
	pip: boolean;
	togglePip: () => void;
}

export const createPipStore: StateCreator<
	PipStore & PlayerSkinStore,
	[],
	[],
	PipStore
> = (set) => ({
	pip: false,
	togglePip: () =>
		set((state) => ({
			pip: !state.pip,
			idle: false,
		})),
});
