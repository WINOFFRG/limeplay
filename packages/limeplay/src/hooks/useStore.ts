import { create } from 'zustand';
import { createFullscreenStore, FullscreenStore } from './useFullsceenStore';
import {
	createMediaProgressStore,
	MediaProgressStore,
} from './useMediaProgressStore';
import { createMediaStore, MediaStore } from './useMediaStore';
import { createPipStore, PipStore } from './usePipStore';
import { createPlayerRootStore, PlayerRootStore } from './usePlayerRootStore';
import { createVolumeStore, VolumeStore } from './useVolumeStore';

type UseStore = FullscreenStore &
	MediaProgressStore &
	MediaStore &
	PipStore &
	PlayerRootStore &
	VolumeStore;

export const useStore = create<UseStore>()((...etc) => ({
	...createFullscreenStore(...etc),
	...createMediaProgressStore(...etc),
	...createMediaStore(...etc),
	...createPipStore(...etc),
	...createPlayerRootStore(...etc),
	...createVolumeStore(...etc),
}));
