import { useCallback, useEffect, useState } from 'react';
import screenfull from 'screenfull';
import { useStateRef } from '../utils';

// Missing iOS Mobile Support https://github.com/sindresorhus/screenfull#support
export interface UseFullScreenConfig {
	elementRef?: React.RefObject<HTMLElement>;
	playback?: HTMLVideoElement;
	onError?: (event: Event) => void;
	onExit?: () => void;
	onEnter?: () => void;
	onChange?: (event: Event) => void;
}

export function useFullScreen({
	elementRef,
	playback,
	onError,
	onExit,
	onEnter,
	onChange,
}: UseFullScreenConfig = {}) {
	const [isFullScreen, setIsFullScreen, isFullScreenRef] = useStateRef(false);
	const [isFullScreenSupported, setIsFullScreenSupported] = useState(false);

	async function enterFullScreen() {
		try {
			if (document.pictureInPictureElement) {
				await document.exitPictureInPicture();
			}

			if (screenfull.isEnabled) {
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
		if (isFullScreenRef.current) {
			exitFullScreen();
		} else {
			enterFullScreen();
		}
	}

	const fullscreenEventHandler = useCallback(
		(_event: Event) => {
			if (screenfull.isEnabled) {
				setIsFullScreen(screenfull.isFullscreen ?? false);
			} else if (playback && playback.webkitSupportsFullscreen) {
				setIsFullScreen(playback.webkitDisplayingFullscreen);
			}

			if (onChange && typeof onChange === 'function') {
				onChange(_event);
			}
		},
		[playback, onChange]
	);

	useEffect(() => {
		function checkFullScreenSupport() {
			if (screenfull.isEnabled) {
				return true;
			}
			if (playback && playback.webkitSupportsFullscreen) {
				return true;
			}
			return false;
		}

		setIsFullScreenSupported(checkFullScreenSupport());

		function checkSupport_() {
			setIsFullScreenSupported(checkFullScreenSupport());
		}

		// https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1628805-webkitsupportsfullscreen
		// On iOS, Native Video Fullscreen support can only be detected after the video has loaded.
		playback.addEventListener('loadedmetadata', checkSupport_);
		playback.addEventListener('loadeddata', checkSupport_);

		fullscreenEventHandler({} as Event);

		return () => {
			playback.removeEventListener('loadedmetadata', checkSupport_);
			playback.removeEventListener('loadeddata', checkSupport_);
		};
	}, [playback]);

	useEffect(() => {
		if (screenfull.isEnabled) {
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
			if (screenfull.isEnabled) {
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
	}, [elementRef, onError, playback, onChange, fullscreenEventHandler]);

	return {
		isFullScreen,
		enterFullScreen,
		exitFullScreen,
		toggleFullScreen,
		isFullScreenSupported,
		api: screenfull,
	};
}
