import { usePlayback } from '@limeplay/core';
import { useEffect } from 'react';
import { useHotkeys } from '@mantine/hooks';
import { IconButton } from '@/components/common/Buttons';
import { PauseIcon, PlayIcon } from '../Icons/Icons';

export function PlaybackControl() {
	const { isPlaying, togglePlayback } = usePlayback();

	useHotkeys([
		['Space', () => togglePlayback()],
		['k', () => togglePlayback()],
	]);

	return (
		<IconButton
			onClick={togglePlayback}
			aria-label={isPlaying ? 'Pause' : 'Play'}
		>
			{isPlaying ? <PauseIcon /> : <PlayIcon />}
		</IconButton>
	);
}
