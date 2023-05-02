/* eslint-disable jsx-a11y/media-has-caption */
import { useRef, useEffect, useState } from 'react';
import { useShakaPlayer } from '@limeplay/shaka-player';
import { createStyles } from '@mantine/styles';
import { LimeplayProvider, OverlayOutlet } from '@limeplay/core';
import PlayerOverlay from '@/components/Player/PlayerOverlay';

const useStyles = createStyles((theme) => ({
	videoElement: {
		display: 'block',
		width: '100%',
		height: '100%',
		objectFit: 'contain',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundColor: 'black',
	},
}));

export default function Player() {
	const playbackRef = useRef<HTMLMediaElement>(null);
	const { classes } = useStyles();
	const player = useShakaPlayer(playbackRef);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	return (
		<LimeplayProvider>
			{isLoaded && (
				<OverlayOutlet playback={playbackRef} player={player}>
					<PlayerOverlay />
				</OverlayOutlet>
			)}
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
