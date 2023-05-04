/* eslint-disable jsx-a11y/media-has-caption */
import { useShakaPlayer } from '@limeplay/shaka-player';
import { createStyles } from '@mantine/styles';
import { LimeplayProvider, OverlayOutlet, MediaOutlet } from '@limeplay/core';
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
	const { classes } = useStyles();
	const createPlayer = useShakaPlayer();

	return (
		<LimeplayProvider>
			<OverlayOutlet createPlayer={createPlayer}>
				<PlayerOverlay />
			</OverlayOutlet>
			<MediaOutlet>
				<video
					controls={false}
					playsInline
					className={classes.videoElement}
					autoPlay
				/>
			</MediaOutlet>
		</LimeplayProvider>
	);
}
