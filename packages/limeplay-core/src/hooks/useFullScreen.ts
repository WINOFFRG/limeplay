import { useEffect, useRef, useState } from 'react';
import screenfull from 'screenfull';

export interface UseFullScreenConfig {
	elementRef?: React.RefObject<HTMLElement>;
	onError?: (event: Event) => void;
	disabled?: boolean;
}

export function useFullScreen({
	elementRef,
	onError,
	disabled,
}: UseFullScreenConfig = {}) {
	const [isFullScreen, setIsFullScreen] = useState(screenfull.isFullscreen);
	// Missing iOS Mobile Support https://github.com/sindresorhus/screenfull#support

	useEffect(() => {
		const fullscreenEventHandler = () => {
			setIsFullScreen(screenfull.isFullscreen);
		};

		if (screenfull.isEnabled && !disabled) {
			screenfull.on('change', fullscreenEventHandler);

			if (onError && typeof onError === 'function') {
				screenfull.on('error', onError);
			}
		}

		return () => {
			if (screenfull.isEnabled && !disabled) {
				screenfull.off('change', fullscreenEventHandler);

				if (onError && typeof onError === 'function') {
					screenfull.off('error', onError);
				}
			}
		};
	}, [elementRef, onError, disabled]);

	return {
		isFullScreen,
		api: screenfull,
	};
}
