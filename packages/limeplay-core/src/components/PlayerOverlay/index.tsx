import { useLoading, usePlayback, useTimeline, useVolume } from '../../hooks';
import { useLimeplayStore } from '../../store';
import ControlsOverlay from '../ControlsOverlay';
import PlayerLoader from '../Loader';
import useStyles from './styles';

export default function PlayerOverlay() {
	const { classes } = useStyles();

	const player = useLimeplayStore((state) => state.playback);
	useLoading();
	// useTimeline();

	return (
		<div className={classes.overlayWrapper}>
			<PlayerLoader />
			{player && <ControlsOverlay />}
		</div>
	);
}
