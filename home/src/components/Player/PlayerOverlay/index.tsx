import {
	useLoading,
	usePlayback,
	useTimeline,
	useVolume,
} from '@limeplay/core/src/hooks';
import { useLimeplayStore } from '@limeplay/core/src/store';
import ControlsOverlay from '../ControlsOverlay';
import useStyles from './styles';
import PlayerLoader from '../Loader';

export default function PlayerOverlay() {
	const { classes } = useStyles();

	const player = useLimeplayStore((state) => state.playback);
	useLoading();
	useVolume();
	useTimeline();
	usePlayback();

	return (
		<div className={classes.overlayWrapper}>
			<PlayerLoader />
			{player && <ControlsOverlay />}
		</div>
	);
}
