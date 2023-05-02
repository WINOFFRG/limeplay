/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef } from 'react';
import { useShakaPlayer } from '@limeplay/shaka-player';
import { createStyles } from '@mantine/styles';
import { LimeplayProvider, OverlayOutlet } from '@limeplay/core';
import PlayerOverlay from '@/components/Player/PlayerOverlay';

const useStyles = createStyles((theme) => ({
	videoElement: {
		// opacity: 0.1,
		display: 'block',
		width: '100%',
		height: '100%',
		objectFit: 'contain',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		// backgroundColor: 'white',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
}));

export default function Player() {
	const playbackRef = useRef<HTMLMediaElement>(null);
	const { classes } = useStyles();
	const player = useShakaPlayer(playbackRef);

	return (
		<LimeplayProvider>
			<OverlayOutlet playback={playbackRef} player={player}>
				<PlayerOverlay />
			</OverlayOutlet>
			<video
				controls={false}
				playsInline
				ref={playbackRef as React.RefObject<HTMLVideoElement>}
				className={classes.videoElement}
				autoPlay
			/>
		</LimeplayProvider>
	);
}
