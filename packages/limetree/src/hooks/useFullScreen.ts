import { useEffect, useState } from 'react';
import screenfull from 'screenfull';

interface UseFullScreenProps {
	toggleOrientation?: boolean;
	onError?: (event: Event) => void;
	onOrientationChangeError?: (error: Error) => void;
}

interface UseFullScreenReturn {
	isFullscreen: boolean;
	toggleFullscreen: () => void;
	orientation: string;
}

export default function useFullScreen(
	elementRef: React.RefObject<HTMLElement>,
	{
		toggleOrientation = true,
		onError,
		onOrientationChangeError,
	}: UseFullScreenProps
) {
	const [isFullscreen, setIsFullscreen] = useState(
		(screenfull.isEnabled && screenfull.isFullscreen) || false
	);
	const [orientation, setOrientation] = useState<string>(
		window.screen.orientation.type
	);

	const orientationError = (error: Error) => {
		if (
			onOrientationChangeError &&
			typeof onOrientationChangeError === 'function'
		) {
			onOrientationChangeError(error);
		}
	};

	const toggleFullscreen = () => {
		if (!elementRef.current) return;

		if (screenfull.isEnabled) {
			if (isFullscreen) {
				screenfull.exit();
			} else {
				screenfull.request(elementRef.current).then(() => {
					if (!toggleOrientation) return;

					if (orientation === 'landscape-primary') {
						window.screen.orientation
							.lock('portrait')
							.catch(orientationError);
					} else {
						window.screen.orientation
							.lock('landscape')
							.catch(orientationError);
					}
				});
			}
		}

		// Missing iOS Mobile Support https://github.com/sindresorhus/screenfull#support
	};

	useEffect(() => {
		const fullscreenEventHandler = () => {
			setIsFullscreen(screenfull.isFullscreen);
		};

		const orientationEventHandler = () => {
			setOrientation(window.screen.orientation.type);
		};

		if (screenfull.isEnabled) {
			screenfull.on('change', fullscreenEventHandler);

			if (onError && typeof onError === 'function') {
				screenfull.on('error', onError);
			}
		}

		if (toggleOrientation) {
			window.addEventListener(
				'orientationchange',
				orientationEventHandler
			);
		}

		return () => {
			if (screenfull.isEnabled) {
				screenfull.off('change', fullscreenEventHandler);

				if (onError && typeof onError === 'function') {
					screenfull.off('error', onError);
				}
			}

			if (toggleOrientation) {
				window.removeEventListener(
					'orientationchange',
					orientationEventHandler
				);
			}
		};
	}, [elementRef, onError, toggleOrientation]);

	return {
		isFullscreen,
		toggleFullscreen,
		orientation,
	} as UseFullScreenReturn;
}
