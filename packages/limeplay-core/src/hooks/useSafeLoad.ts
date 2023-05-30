import { useEffect } from 'react';
import { StateCreator } from 'zustand';
import { useLimeplayStore } from '../store';

export interface UseSafeLoadConfig {
	/**
	 * ShakaPlayer events to listen to
	 * @default Events - ['buffering', 'loading']
	 */
	events?: ShakaPlayerEvents;
}
export function useSafeLoad() {
	const player = useLimeplayStore((state) => state.player);
	const setIsSafeLoad = useLimeplayStore((state) => state._setIsSafeLoad);

	useEffect(() => {
		if (!player) return null;

		const handleSafeLoad = (event) => {
			const isSafeLoad = event.type === 'loaded';
			setIsSafeLoad(isSafeLoad);
		};

		const hookEvents: ShakaPlayerEvents = ['loaded', 'loading'];

		hookEvents.forEach((event) => {
			player.addEventListener(event, handleSafeLoad);
		});

		return () => {
			if (player) {
				hookEvents.forEach((event) => {
					player.removeEventListener(event, handleSafeLoad);
				});
			}
		};
	}, [player]);
}

export interface SafeLoadSlice {
	isSafeLoad: boolean;
	_setIsSafeLoad: (state: boolean) => void;
}

export const createSafeLoadSlice: StateCreator<SafeLoadSlice> = (set) => ({
	isSafeLoad: true,
	_setIsSafeLoad: (state) => set({ isSafeLoad: state }),
});
