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

import {
	UseBufferConfig,
	useBufferInfo,
	BufferSlice,
	createBufferSlice,
} from './useBufferInfo';

import {
	UseSafeLoadConfig,
	useSafeLoad,
	SafeLoadSlice,
	createSafeLoadSlice,
} from './useSafeLoad';

import {
	UseFullScreenConfig,
	useFullScreen,
	FullScreenSlice,
	createFullScreenSlice,
} from './useFullScreen';

export {
	createPlaybackSlice,
	createLoadingSlice,
	createVolumeSlice,
	createTimelineSlice,
	createBufferSlice,
	createSafeLoadSlice,
	createFullScreenSlice,
};

type StoreSlice = PlaybackSlice &
	LoadingSlice &
	VolumeSlice &
	TimelineSlice &
	BufferSlice &
	SafeLoadSlice &
	FullScreenSlice;

export {
	usePlayback,
	useLoading,
	useVolume,
	useTimeline,
	useBufferInfo,
	useSafeLoad,
	useFullScreen,
};

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
	BufferSlice,
	UseBufferConfig,
	SafeLoadSlice,
	UseSafeLoadConfig,
	FullScreenSlice,
	UseFullScreenConfig,
};
