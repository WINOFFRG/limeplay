import { RefObject, useContext } from 'react';
import { create, useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import shaka from 'shaka-player';
import { LimeplayContext } from './context';

interface InitialProps {
	mediaElementRef: RefObject<HTMLMediaElement>;
}

const log = (config) => (set, get, api) =>
	config(
		(args) => {
			console.log('  applying', args);
			set(args);
			// console.log('  new state', get());
		},
		get,
		api
	);

export function createLimeplayStore({ mediaElementRef }: InitialProps) {
	const element = mediaElementRef.current;

	if (!element) return null;

	const player = new shaka.Player(element);

	player.configure({
		drm: {
			clearKeys: {
				'31f563ec4d055f04a7077e638b046de4':
					'695248391f00f7395e51f0e13201ed00',
			},
		},
	});

	player.load(
		'https://bpprod6linear.akamaized.net/bpk-tv/irdeto_com_Channel_637/output/manifest.mpd'
	);

	const store = createStore<Store>()(
		log(
			devtools(
				(set, get) => ({
					playback: element,
					player,
					isPlaying: false,
					setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
					togglePlayback: () => {
						console.log('togglePlayback');
					},
					setTogglePlayback: (fn: () => void) =>
						set({ togglePlayback: fn }),
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
	selector: (state: Store) => T,
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
