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
		// opacity: 0.05,
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
						controls={false}
						playsInline
						autoPlay
						className={classes.videoElement}
					/>
				</MediaOutlet>
			</ErrorBoundary>
		</LimeplayProvider>
	);
}
