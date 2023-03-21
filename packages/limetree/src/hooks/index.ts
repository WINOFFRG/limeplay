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

export { createPlaybackSlice, createLoadingSlice };

type StoreSlice = PlaybackSlice & LoadingSlice;

export { usePlayback, useLoading };

export type {
	StoreSlice,
	PlaybackSlice,
	UsePlaybackConfig,
	LoadingSlice,
	UseLoadingConfig,
};
