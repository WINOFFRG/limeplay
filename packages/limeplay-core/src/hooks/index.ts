import { UsePlaybackConfig, usePlayback } from './usePlayback';

import { UseLoadingConfig, useLoading } from './useLoading';

import { UseVolumeConfig, useVolume } from './useVolume';

import { UseTimelineConfig, useTimeline } from './useTimeline';

import { UsePiPConfig, usePiP } from './usePiP';

import { UseQualityConfig, useQuality } from './useQuality';

import { UseLiveConfig, useLive } from './useLive';

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

import { UseFullScreenConfig, useFullScreen } from './useFullScreen';

import { useOrientation, UseOrientationConfig } from './useOrientation';

export { createBufferSlice, createSafeLoadSlice };

type StoreSlice = BufferSlice & SafeLoadSlice;

export {
	usePlayback,
	useLoading,
	useVolume,
	useTimeline,
	useBufferInfo,
	useSafeLoad,
	useFullScreen,
	useOrientation,
	usePiP,
	useQuality,
	useLive,
};

export type {
	StoreSlice,
	UsePlaybackConfig,
	UseLoadingConfig,
	UseVolumeConfig,
	UseTimelineConfig,
	BufferSlice,
	UseBufferConfig,
	SafeLoadSlice,
	UseSafeLoadConfig,
	UseFullScreenConfig,
	UsePiPConfig,
	UseQualityConfig,
	UseLiveConfig,
};
