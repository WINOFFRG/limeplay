import { RefObject, memo, useContext } from 'react';
import { create, useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { LimeplayContext } from './context';
import { logger } from './utils';
import {
	StoreSlice,
	createBufferSlice,
	createLoadingSlice,
	createPlaybackSlice,
	createTimelineSlice,
	createVolumeSlice,
} from '../hooks';

export function createLimeplayStore() {
	// playback?: HTMLMediaElement,
	// player?: shaka.Player | null
	// const element = mediaElementRef.current;

	// if (!element) return null;

	// const player = new shaka.Player(element);

	// player.configure({
	// 	drm: {
	// 		clearKeys: {
	// 			'31f563ec4d055f04a7077e638b046de4':
	// 				'695248391f00f7395e51f0e13201ed00',
	// 		},
	// 	},
	// });

	// player.load(
	// 	'https://storage.googleapis.com/nodejs-streaming.appspot.com/uploads/f6b7c492-e78f-4b26-b95f-81ea8ca21a18/1642708128072/manifest.mpd'
	// );
	// player.load(
	// 	'https://bpprod6linear.akamaized.net/bpk-tv/irdeto_com_Channel_637/output/manifest.mpd'
	// );

	const store = createStore<InitialStore & StoreSlice>()(
		logger(
			devtools(
				(set, get, storeApi) => ({
					playback: null,
					setPlayback: (playback: HTMLMediaElement) =>
						set({ playback }),
					player: null,
					setPlayer: (player: shaka.Player) => set({ player }),
					...createPlaybackSlice(set, get, storeApi),
					...createLoadingSlice(set, get, storeApi),
					...createVolumeSlice(set, get, storeApi),
					...createTimelineSlice(set, get, storeApi),
					...createBufferSlice(set, get, storeApi),
				}),
				{
					name: 'Limeplay Store',
				}
			)
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
