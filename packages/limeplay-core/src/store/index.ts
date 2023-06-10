import { RefObject, memo, useContext } from 'react';
import { create, useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { LimeplayContext } from './context';
import { logger } from './utils';
import {
	StoreSlice,
	createBufferSlice,
	createFullScreenSlice,
	createLoadingSlice,
	createSafeLoadSlice,
	createTimelineSlice,
	createVolumeSlice,
} from '../hooks';

export function createLimeplayStore() {
	const store = createStore<InitialStore & StoreSlice>()(
		logger(
			// devtools(
			(set, get, storeApi) => ({
				playback: null,
				setPlayback: (playback: HTMLMediaElement) => set({ playback }),
				player: null,
				setPlayer: (player: shaka.Player) => set({ player }),
				...createTimelineSlice(set, get, storeApi),
				...createBufferSlice(set, get, storeApi),
				...createSafeLoadSlice(set, get, storeApi),
			})
			// 	{
			// 		name: 'Limeplay Store',
			// 	}
			// )
		)
	);

	return store;
}

export function useLimeplayStore<T>(
	selector: (state: InitialStore & StoreSlice) => T,
	equalityFn?: (left: T, right: T) => boolean
): T {
	const store = useContext(LimeplayContext);
	if (!store) throw new Error('Missing LimeplayContext.Provider in the tree');
	return useStore(store, selector, equalityFn);
}

export function useLimeplayStoreAPI() {
	const store = useContext(LimeplayContext);
	if (!store) throw new Error('Missing LimeplayContext.Provider in the tree');
	return store;
}

export type LimeplayStore = ReturnType<typeof createLimeplayStore>;
