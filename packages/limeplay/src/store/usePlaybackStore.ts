import { create, StateCreator } from 'zustand';

export type MediaStatus =
	| 'init'
	| 'error'
	| 'playing'
	| 'paused'
	| 'stopped'
	| 'ended'
	| 'buffering';

export interface PlaybackStore {
	/** The status of the media player. */
	status: MediaStatus;
	setStatus: (status: MediaStatus) => void;
	/** Whether the media is paused. */
	paused: boolean;
	setPaused: (paused: boolean) => void;
}

export const createPlaybackStore: StateCreator<
	PlaybackStore,
	[],
	[],
	PlaybackStore
> = (set) => ({
	paused: true,
	setStatus: (status: MediaStatus) => set({ status }),
	status: 'init',
	setPaused: (paused: boolean) => set({ paused }),
});
