import { useEffect, useState } from 'react';
import { useStateRef } from '../utils';
import { useLimeplay } from '../components';

export interface UsePiPConfig {
	onError?: (event: Event) => void;
	onExit?: () => void;
	onEnter?: () => void;
	onChange?: (event: Event) => void;
	onResize?: (event: Event) => void;
}

export function usePiP({
	onError,
	onExit,
	onEnter,
	onChange,
	onResize,
}: UsePiPConfig = {}) {
	const { playbackRef, playerRef } = useLimeplay();
	const playback = playbackRef.current;
	const player = playerRef.current;
	const [isPiPActive, setIsPiPActive, isPiPActiveRef] = useStateRef(false);
	const [isPiPSupported, setIsPiPSupported] = useState(false);
	const [isPiPAllowed, setIsPiPAllowed] = useState(false);
	const [pipWindow, setPipWindow] = useState<PictureInPictureWindow | null>(
		null
	);

	const pipError = (error) => {
		if (onError && typeof onError === 'function') {
			onError(error);
		}
	};

	const togglePiP = async () => {
		if (!document.pictureInPictureElement) {
			playbackRef.current
				.requestPictureInPicture()
				.then((_pipWindow) => {
					setPipWindow(_pipWindow);

					if (onEnter && typeof onEnter === 'function') {
						onEnter();
					}

					_pipWindow.addEventListener('resize', (event) => {
						if (onResize && typeof onResize === 'function') {
							onResize(event);
						}
					});
				})
				.catch(pipError);
		} else {
			document
				.exitPictureInPicture()
				.then(() => {
					setPipWindow(null);

					if (onExit && typeof onExit === 'function') {
						onExit();
					}
				})
				.catch(pipError);
		}
	};

	useEffect(() => {
		if (!document.pictureInPictureEnabled) {
			setIsPiPSupported(false);
			return undefined;
		}

		if (!playback.disablePictureInPicture) {
			setIsPiPAllowed(true);
		}

		setIsPiPSupported(true);

		if (document.pictureInPictureElement) {
			if (document.pictureInPictureElement !== playback) {
				document.exitPictureInPicture();
			} else {
				setIsPiPActive(true);
			}
		}

		const pipEventHandler = (_event: Event) => {
			if (document.pictureInPictureElement) {
				setIsPiPActive(true);
			} else {
				setIsPiPActive(false);
			}

			if (onChange && typeof onChange === 'function') {
				onChange(_event);
			}
		};

		const trackChangeHandler = async () => {
			if (player.isAudioOnly() && isPiPActiveRef.current) {
				await togglePiP();
			}
		};

		const events = ['enterpictureinpicture', 'leavepictureinpicture'];

		events.forEach((event) => {
			playback.addEventListener(event, pipEventHandler);
		});

		if (player) {
			player.addEventListener('trackschanged', trackChangeHandler);
		}

		return () => {
			if (playback) {
				events.forEach((event) => {
					playback.removeEventListener(event, pipEventHandler);
				});
			}

			if (player) {
				player.removeEventListener('trackschanged', trackChangeHandler);
			}
		};
	}, [onChange, onResize]);

	return {
		isPiPActive,
		isPiPSupported,
		isPiPAllowed,
		pipWindow,
		togglePiP,
	} as const;
}
