import { create, StateCreator } from 'zustand';

export interface VolumeStore {
	volume: number;
	muted: boolean;
	toggleMute: () => void;
}

// case "TOGGLE_MUTE": {
// 	return merge({}, state, {
// 	  muted: !state.muted,
// 	  volume: state.volume === 0 ? VOLUME_SMALL : state.volume,
// 	  idle: false,
// 	});
//   }

const VOLUME_SMALL = 0.05;

export const createVolumeStore: StateCreator<
	VolumeStore,
	[],
	[],
	VolumeStore
> = (set) => ({
	volume: 1,
	muted: false,
	toggleMute: () =>
		set((state) => ({
			muted: !state.muted,
			volume: state.volume === 0 ? VOLUME_SMALL : state.volume,
			idle: false,
		})),
});
