import { RefObject, memo, useContext } from 'react';
import { create, useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import shaka from 'shaka-player';
import { LimeplayContext } from './context';
import { logger } from './utils';
import {
	StoreSlice,
	createLoadingSlice,
	createPlaybackSlice,
	createTimelineSlice,
	createVolumeSlice,
} from '../hooks';

interface InitialProps {
	mediaElementRef: RefObject<HTMLMediaElement>;
}

export function createLimeplayStore({ mediaElementRef }: InitialProps) {
	const element = mediaElementRef.current;

	if (!element) return null;

	const player = new shaka.Player(element);

	player.load(
		'https://storage.googleapis.com/nodejs-streaming.appspot.com/uploads/f6b7c492-e78f-4b26-b95f-81ea8ca21a18/1642708128072/manifest.mpd'
	);

	const store = createStore<InitialStore & StoreSlice>()(
		logger(
			devtools(
				(set, get, storeApi) => ({
					playback: element,
					player,
					...createPlaybackSlice(set, get, storeApi),
					...createLoadingSlice(set, get, storeApi),
					...createVolumeSlice(set, get, storeApi),
					...createTimelineSlice(set, get, storeApi),
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
