import {
	UsePlaybackConfig,
	usePlayback,
	PlaybackSlice,
	createPlaybackSlice,
} from './usePlayback';

import {
	UseLoadingConfig,
	useLoading,
	LoadingSlice,
	createLoadingSlice,
} from './useLoading';

import {
	UseVolumeConfig,
	useVolume,
	VolumeSlice,
	createVolumeSlice,
} from './useVolume';

export { createPlaybackSlice, createLoadingSlice, createVolumeSlice };

type StoreSlice = PlaybackSlice & LoadingSlice & VolumeSlice;

export { usePlayback, useLoading, useVolume };

export type {
	StoreSlice,
	PlaybackSlice,
	UsePlaybackConfig,
	LoadingSlice,
	UseLoadingConfig,
	VolumeSlice,
	UseVolumeConfig,
};
