import { useEffect } from 'react';
import { StateCreator } from 'zustand';
import { useLimeplayStore } from '../store';

export interface UseLoadingConfig {
	/**
	 * HTMLMediaElement events to listen to
	 * @default Events - ['buffering', 'loading']
	 */
	events?: ShakaPlayerEvents;
}

export function useLoading({ events }: UseLoadingConfig = {}) {
	const player = useLimeplayStore((state) => state.player);
	const setIsLoading = useLimeplayStore((state) => state.setIsLoading);

	useEffect(() => {
		const loadingEventHandler = () => {
			setIsLoading(player.isBuffering());
		};

		const hookEvents: ShakaPlayerEvents = events || [
			'buffering',
			'loading',
		];

		hookEvents.forEach((event) => {
			player.addEventListener(event, loadingEventHandler);
		});

		return () => {
			if (player) {
				hookEvents.forEach((event) => {
					player.removeEventListener(event, loadingEventHandler);
				});
			}
		};
	}, [player]);
}

export interface LoadingSlice {
	isLoading: boolean;
	setIsLoading: (state: boolean) => void;
}

export const createLoadingSlice: StateCreator<LoadingSlice> = (set) => ({
	isLoading: false,
	setIsLoading: (state) => set({ isLoading: state }),
});
