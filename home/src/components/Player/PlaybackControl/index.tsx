import { usePlayback } from '@limeplay/core';
import { useEffect } from 'react';
import { IconButton } from '@/components/common/Buttons';
import { PauseIcon, PlayIcon } from '../Icons/Icons';

export function PlaybackControl() {
	const { isPlaying, togglePlayback } = usePlayback();

	useEffect(() => {
		const spacePlayback = (event: KeyboardEvent) => {
			if (event.code === 'Space') {
				// Check if the focused element is a button
				if (document.activeElement.tagName.toLowerCase() === 'button') {
					// Toggle the button's behavior (performing a click)
					document.activeElement.click();
				} else {
					togglePlayback();
				}
				// Prevent the default Space key behavior (scrolling down the page)
				event.preventDefault();
			}
		};

		document.addEventListener('keydown', spacePlayback);

		return () => {
			document.removeEventListener('keydown', spacePlayback);
		};
	}, [togglePlayback]);

	return (
		<IconButton
			onClick={togglePlayback}
			aria-label={isPlaying ? 'Pause' : 'Play'}
		>
			{isPlaying ? <PauseIcon /> : <PlayIcon />}
		</IconButton>
	);
}
