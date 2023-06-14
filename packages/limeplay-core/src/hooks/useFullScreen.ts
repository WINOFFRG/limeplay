import { useEffect, useState } from 'react';
import screenfull from 'screenfull';

// Missing iOS Mobile Support https://github.com/sindresorhus/screenfull#support
export interface UseFullScreenConfig {
	elementRef?: React.RefObject<HTMLElement>;
	disabled?: boolean;
	playback?: HTMLVideoElement;
	onError?: (event: Event) => void;
	onExit?: () => void;
	onEnter?: () => void;
	onChange?: (event: Event) => void;
}

export function useFullScreen({
	elementRef,
	disabled,
	playback,
	onError,
	onExit,
	onEnter,
	onChange,
}: UseFullScreenConfig = {}) {
	const [isFullScreen, setIsFullScreen] = useState(screenfull.isFullscreen);

	function isFullScreenSupported() {
		if (screenfull.isEnabled) {
			return true;
		}
		if (playback && playback.webkitSupportsFullscreen) {
			return true;
		}
		return false;
	}

	async function enterFullScreen() {
		try {
			if (screenfull.isEnabled) {
				if (document.pictureInPictureElement) {
					await document.exitPictureInPicture();
				}

				await screenfull.request(elementRef.current, {
					navigationUI: 'hide',
				});
			} else if (playback && playback.webkitSupportsFullscreen) {
				playback.webkitEnterFullscreen();
			}

			if (onEnter && typeof onEnter === 'function') {
				onEnter();
			}
		} catch (error) {
			// Entering fullscreen can fail without user interaction.
			if (onError && typeof onError === 'function') {
				onError(error);
			}
		}
	}

	function exitFullScreen() {
		if (screenfull.isEnabled) {
			screenfull.exit();
		} else if (playback && playback.webkitSupportsFullscreen) {
			playback.webkitExitFullscreen();
		}

		if (onExit && typeof onExit === 'function') {
			onExit();
		}
	}

	function toggleFullScreen() {
		if (isFullScreen) {
			exitFullScreen();
		} else {
			enterFullScreen();
		}
	}

	useEffect(() => {
		const fullscreenEventHandler = (_event: Event) => {
			setIsFullScreen(screenfull.isFullscreen);

			if (onChange && typeof onChange === 'function') {
				onChange(_event);
			}
		};

		if (screenfull.isEnabled && !disabled) {
			screenfull.on('change', fullscreenEventHandler);

			if (onError && typeof onError === 'function') {
				screenfull.on('error', onError);
			}
		}

		if (playback && playback.webkitSupportsFullscreen) {
			playback.addEventListener(
				'webkitfullscreenchange',
				fullscreenEventHandler
			);
		}

		return () => {
			if (screenfull.isEnabled && !disabled) {
				screenfull.off('change', fullscreenEventHandler);

				if (onError && typeof onError === 'function') {
					screenfull.off('error', onError);
				}
			}

			if (playback && playback.webkitSupportsFullscreen) {
				playback.removeEventListener(
					'webkitfullscreenchange',
					fullscreenEventHandler
				);
			}
		};
	}, [elementRef, onError, disabled, playback, onChange]);

	return {
		isFullScreen,
		enterFullScreen,
		exitFullScreen,
		toggleFullScreen,
		isFullScreenSupported,
		api: screenfull,
	};
}
