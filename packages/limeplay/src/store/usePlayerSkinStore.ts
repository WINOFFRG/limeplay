import { StateCreator } from 'zustand';

export interface PlayerSkinStore {
	idle: boolean;
	setIdle: (idle: boolean) => void;
	idleLock: boolean;
	setIdleLock: (idleLock: boolean) => void;
	status: MediaStatus;
	setStatus: (status: MediaStatus) => void;
}

export type MediaStatus =
	| 'init'
	| 'buffering'
	| 'ended'
	| 'error'
	| 'paused'
	| 'playing'
	| 'stopped';

export const createPlayerSkinStore: StateCreator<
	PlayerSkinStore,
	[],
	[],
	PlayerSkinStore
> = (set) => ({
	idle: false,
	setIdle: (idle: boolean) => set({ idle }),
	idleLock: false,
	setIdleLock: (idleLock: boolean) => set({ idleLock }),
	status: 'init',
	setStatus: (status: MediaStatus) => set({ status }),
});
