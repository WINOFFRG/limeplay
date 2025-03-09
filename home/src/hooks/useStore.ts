import { create } from 'zustand';

import {
	createFullscreenStore,
	createMediaProgressStore,
	createMediaStore,
	createPipStore,
	createPlayerRootStore,
	createVolumeStore,
	FullscreenStore,
	MediaProgressStore,
	MediaStore,
	PipStore,
	PlayerRootStore,
	VolumeStore,
} from '@limeplay/core';

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
