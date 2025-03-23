import { StateCreator } from 'zustand';
import { PlayerRootStore } from './usePlayerRootStore';

export interface PipStore {
	pip: boolean;
	togglePip: () => void;
}

export const createPipStore: StateCreator<
	PipStore & PlayerRootStore,
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
