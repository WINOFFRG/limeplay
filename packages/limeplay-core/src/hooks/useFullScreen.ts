import { useEffect, useRef, useState } from 'react';
import screenfull from 'screenfull';
import o9n from 'o9n';
import { StateCreator } from 'zustand';
import { useLimeplayStore } from '../store';

export interface UseFullScreenConfig {
	elementRef?: React.RefObject<HTMLElement>;
	toggleOrientation?: boolean;
	onError?: (event: Event) => void;
	onOrientationChangeError?: (error: Error) => void;
}

export interface FullScreenSlice {
	isFullScreen: null | boolean;
	_setIsFullScreen: (isFullScreen: boolean) => void;
	orientation: OrientationType;
	_setOrientation: (orientation: string) => void;
}

export function useFullScreen({
	elementRef,
	toggleOrientation = true,
	onError,
	onOrientationChangeError,
}: UseFullScreenConfig = {}) {
	const setIsFullScreen = useLimeplayStore((state) => state._setIsFullScreen);
	const setOrientation = useLimeplayStore((state) => state._setOrientation);

	const orientationError = (error: Error) => {
		if (
			onOrientationChangeError &&
			typeof onOrientationChangeError === 'function'
		) {
			onOrientationChangeError(error);
		}
	};

	useEffect(() => {
		const fullscreenEventHandler = () => {
			setIsFullScreen(screenfull.isFullscreen);
		};

		const orientationEventHandler = () => {
			setOrientation(o9n.orientation.type as OrientationType);
		};

		if (screenfull.isEnabled) {
			screenfull.on('change', fullscreenEventHandler);

			if (onError && typeof onError === 'function') {
				screenfull.on('error', onError);
			}
		}

		o9n.orientation.addEventListener('change', orientationEventHandler);

		return () => {
			if (screenfull.isEnabled) {
				screenfull.off('change', fullscreenEventHandler);

				if (onError && typeof onError === 'function') {
					screenfull.off('error', onError);
				}
			}

			o9n.orientation.removeEventListener(
				'change',
				orientationEventHandler
			);
		};
	}, [elementRef, onError, toggleOrientation]);
}

export const createFullScreenSlice: StateCreator<FullScreenSlice> = (set) => ({
	isFullScreen: null,
	_setIsFullScreen: (isFullScreen: boolean) => set({ isFullScreen }),
	orientation: o9n.orientation.type,
	_setOrientation: (orientation: string) =>
		set({ orientation: orientation as OrientationType }),
});
