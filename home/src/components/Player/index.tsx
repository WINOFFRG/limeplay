/* eslint-disable jsx-a11y/media-has-caption */
import { useShakaPlayer } from '@limeplay/shaka-player';
import { createStyles } from '@mantine/styles';
import { LimeplayProvider, OverlayOutlet, MediaOutlet } from '@limeplay/core';
import { ErrorBoundary } from '@sentry/nextjs';
import PlayerOverlay from '@/components/Player/PlayerOverlay';
import { PlayerError } from '../PlayerError';

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
	const { classes } = useStyles();
	const createPlayer = useShakaPlayer();

	return (
		<ErrorBoundary
			fallback={PlayerError}
			onError={(error, componentStack) => {
				console.log(error);
			}}
		>
			<LimeplayProvider>
				<OverlayOutlet createPlayer={createPlayer}>
					<PlayerOverlay />
				</OverlayOutlet>
				<MediaOutlet>
					<video
						poster="/video-poster.jpg"
						controls={false}
						playsInline
						className={classes.videoElement}
						autoPlay={false}
					/>
				</MediaOutlet>
			</LimeplayProvider>
		</ErrorBoundary>
	);
}
