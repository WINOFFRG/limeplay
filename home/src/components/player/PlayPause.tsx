import { useStore } from '@/hooks/useStore';
import { PlaybackControl } from '@limeplay/core';
import React from 'react';
import { Button } from '../ui/button';
import { PauseIcon } from '../icons/PauseIcon';
import { ReplayIcon } from '../icons/ReplayIcon';
import { Spinner } from '../icons/Spinner';
import { PlayIcon } from '../icons/PlayIcon';

export const PlayPause = () => {
	const status = useStore((state) => state.status);

	const tooltipTitle = React.useMemo(() => {
		return status === 'playing'
			? 'Pause'
			: status === 'ended'
			? 'Replay'
			: status === 'buffering'
			? 'Loading'
			: 'Play';
	}, []);

	return (
		<PlaybackControl>
			<Button asChild size="icon" variant="glass">
				{status === 'playing' ? (
					<PauseIcon />
				) : status === 'ended' ? (
					<ReplayIcon />
				) : status === 'buffering' ? (
					<Spinner />
				) : (
					<PlayIcon />
				)}
			</Button>
		</PlaybackControl>
	);
};
