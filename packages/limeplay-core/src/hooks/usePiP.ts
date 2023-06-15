import { useEffect, useState } from 'react';

export interface UsePiPConfig {
	playback: HTMLVideoElement;
	events?: HTMLVideoElementEvents;
	onError?: (event: Event) => void;
	onExit?: () => void;
	onEnter?: () => void;
	onChange?: (event: Event) => void;
	onResize?: (event: Event) => void;
}

export function usePiP({
	playback,
	events = ['enterpictureinpicture', 'leavepictureinpicture'],
	onError,
	onExit,
	onEnter,
	onChange,
	onResize,
}: UsePiPConfig) {
	const [isPiPActive, setIsPiPActive] = useState(false);
	const [isPiPSupported, setIsPiPSupported] = useState(true);
	const [pipWindow, setPipWindow] = useState<PictureInPictureWindow | null>(
		null
	);

	const pipError = (error) => {
		if (onError && typeof onError === 'function') {
			onError(error);
		}
	};

	const togglePiP = () => {
		if (!document.pictureInPictureElement) {
			playback
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
			return null;
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

		events.forEach((event) => {
			playback.addEventListener(event, pipEventHandler);
		});

		return () => {
			if (playback) {
				events.forEach((event) => {
					playback.removeEventListener(event, pipEventHandler);
				});
			}
		};
	}, [playback, events, onChange, onResize]);

	return {
		isPiPActive,
		isPiPSupported,
		pipWindow,
		togglePiP,
	};
}
