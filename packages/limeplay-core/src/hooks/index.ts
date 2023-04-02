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

import {
	UseTimelineConfig,
	useTimeline,
	TimelineSlice,
	createTimelineSlice,
} from './useTimeline';

export {
	createPlaybackSlice,
	createLoadingSlice,
	createVolumeSlice,
	createTimelineSlice,
};

type StoreSlice = PlaybackSlice & LoadingSlice & VolumeSlice & TimelineSlice;

export { usePlayback, useLoading, useVolume, useTimeline };

export type {
	StoreSlice,
	PlaybackSlice,
	UsePlaybackConfig,
	LoadingSlice,
	UseLoadingConfig,
	VolumeSlice,
	UseVolumeConfig,
	TimelineSlice,
	UseTimelineConfig,
};
