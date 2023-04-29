import {
	useLoading,
	usePlayback,
	useTimeline,
	useVolume,
} from '@limeplay/core/src/hooks';
import { useLimeplayStore } from '@limeplay/core/src/store';
import PlayerLoader from '@limeplay/core/src/components/Loader';
import ControlsOverlay from '../ControlsOverlay';
import useStyles from './styles';

export default function PlayerOverlay() {
	const { classes } = useStyles();

	const player = useLimeplayStore((state) => state.playback);
	useLoading();
	useVolume();

	// useTimeline();

	return (
		<div className={classes.overlayWrapper}>
			<PlayerLoader />
			{player && <ControlsOverlay />}
		</div>
	);
}
