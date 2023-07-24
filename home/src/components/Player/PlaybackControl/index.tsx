import { usePlayback } from '@limeplay/core';
import { useEffect } from 'react';
import { IconButton } from '@/components/common/Buttons';
import { PauseIcon, PlayIcon } from '../Icons/Icons';

export function PlaybackControl() {
	const { isPlaying, togglePlayback } = usePlayback();

	useEffect(() => {
		const spacePlayback = (e) => {
			if (e.code === 'Space') {
				togglePlayback();
				e.preventDefault();
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
