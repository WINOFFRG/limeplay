import { UsePlaybackConfig, usePlayback } from './usePlayback';
import { UseLoadingConfig, useLoading } from './useLoading';
import { UseVolumeConfig, useVolume } from './useVolume';
import { UseTimelineConfig, useTimeline } from './useTimeline';
import { UsePiPConfig, usePiP } from './usePiP';
import { UseQualityConfig, useQuality } from './useQuality';
import { UseLiveConfig, useLive } from './useLive';
import { UseBufferConfig, useBufferInfo } from './useBufferInfo';
import { UseFullScreenConfig, useFullScreen } from './useFullScreen';
import { useOrientation, UseOrientationConfig } from './useOrientation';

import {
	UseSafeLoadConfig,
	useSafeLoad,
	SafeLoadSlice,
	createSafeLoadSlice,
} from './useSafeLoad';

export { createSafeLoadSlice };

type StoreSlice = SafeLoadSlice;

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
	UseBufferConfig,
	SafeLoadSlice,
	UseSafeLoadConfig,
	UseFullScreenConfig,
	UseOrientationConfig,
	UsePiPConfig,
	UseQualityConfig,
	UseLiveConfig,
};
