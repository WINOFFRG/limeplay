import { useFullScreen, useOrientation } from '@limeplay/core';
import { useRef } from 'react';
import { useHotkeys } from '@mantine/hooks';
import { IconButton } from '@/components/common/Buttons';
import { FullscreenEnter, FullscreenExit } from '../Icons/Icons';

export function FullscreenControl() {
	const elementRef = useRef(document.getElementById('limeplay-player'));

	const { lockOrientation, unlockOrientation, orientation } = useOrientation({
		onError: (error) => {
			console.error(error);
		},
		onChange: (event) => {
			if (orientation.type.includes('landscape') && !isFullScreen) {
				enterFullScreen();
			} else if (orientation.type.includes('portrait') && isFullScreen) {
				exitFullScreen();
			}
		},
	});

	const {
		isFullScreen,
		toggleFullScreen,
		isFullScreenSupported,
		enterFullScreen,
		exitFullScreen,
	} = useFullScreen({
		elementRef,
		onEnter: () => {
			lockOrientation('landscape');
		},
		onExit: unlockOrientation,
		onError: (error) => {
			console.error('Hook: ', error);
		},
	});

	useHotkeys([['f', () => toggleFullScreen()]]);

	return (
		<IconButton
			aria-label={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
			disabled={!isFullScreenSupported}
			onClick={toggleFullScreen}
		>
			{isFullScreen ? <FullscreenExit /> : <FullscreenEnter />}
		</IconButton>
	);
}
