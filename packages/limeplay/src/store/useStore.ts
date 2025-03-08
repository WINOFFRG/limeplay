import { create } from 'zustand';
import { createPlaybackStore, PlaybackStore } from './usePlaybackStore';
import { createVolumeStore, VolumeStore } from './useVolumeStore';
import { createPlayerSkinStore, PlayerSkinStore } from './usePlayerSkinStore';
import { createPipStore, PipStore } from './usePipStore';
import { createMediaStore, MediaStore } from './useMediaStore';
import {
	createMediaProgressStore,
	MediaProgressStore,
} from './useMediaProgressStore';

type UseStore = PlayerSkinStore &
	PlaybackStore &
	VolumeStore &
	PipStore &
	MediaStore &
	MediaProgressStore;

export const useStore = create<UseStore>()((...etc) => ({
	...createPlayerSkinStore(...etc),
	...createPlaybackStore(...etc),
	...createVolumeStore(...etc),
	...createPipStore(...etc),
	...createMediaStore(...etc),
	...createMediaProgressStore(...etc),
}));
