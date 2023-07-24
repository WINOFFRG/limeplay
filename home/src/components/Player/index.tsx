/* eslint-disable jsx-a11y/media-has-caption */
import { createStyles } from '@mantine/styles';
import { LimeplayProvider, MediaOutlet } from '@limeplay/core';
import { ErrorBoundary } from '@sentry/nextjs';
import { PlayerOutlet } from '@/components/Player/PlayerOverlay';
import { PlayerError } from '../PlayerError';

const useStyles = createStyles((theme) => ({
	videoElement: {
		width: '100%',
		height: '100%',
		backgroundColor: 'black',
		// opacity: 0.1,
	},
}));

export default function Player() {
	const { classes } = useStyles();

	return (
		<LimeplayProvider>
			<ErrorBoundary fallback={PlayerError}>
				<PlayerOutlet />
				<MediaOutlet>
					<video
						poster="/video-poster.jpg"
						controls={false}
						playsInline
						className={classes.videoElement}
						autoPlay
						muted
					/>
				</MediaOutlet>
			</ErrorBoundary>
		</LimeplayProvider>
	);
}
