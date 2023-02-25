import { useEffect, useState } from 'react';
import screenfull from 'screenfull';

export default function useFullScreen(
	elementRef: React.RefObject<HTMLElement>,
	{
		onError,
	}: {
		onError?: (error: Error) => void;
	}
) {
	const [isFullscreen, setIsFullscreen] = useState(
		(screenfull.isEnabled && screenfull.isFullscreen) || false
	);

	const toggleFullscreen = () => {
		if (!elementRef.current) return;

		if (screenfull.isEnabled) {
			if (isFullscreen) {
				screenfull.exit();
			} else {
				screenfull.request(elementRef.current);
			}
		}

		// https://github.com/sindresorhus/screenfull#support
	};

	useEffect(() => {
		const fullscreenEventHandler = () => {
			setIsFullscreen(screenfull.isFullscreen);
		};

		if (screenfull.isEnabled) {
			screenfull.on('change', fullscreenEventHandler);

			if (onError && typeof onError === 'function') {
				screenfull.on('error', onError);
			}
		}

		return () => {
			if (screenfull.isEnabled) {
				screenfull.off('change', fullscreenEventHandler);

				if (onError && typeof onError === 'function') {
					screenfull.off('error', onError);
				}
			}
		};
	}, [elementRef]);

	return {
		isFullscreen,
		toggleFullscreen,
	};
}
