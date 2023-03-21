import usePlayback from '../../hooks/usePlayback';
import { useLimeplayStore, useLimeplayStoreAPI } from '../../store';
import ControlsOverlay from '../ControlsOverlay';
import PlayerLoader from '../Loader';
import useStyles from './styles';

export default function PlayerOverlay() {
	const { classes } = useStyles();

	const player = useLimeplayStore((state) => state.player);
	const playback = useLimeplayStore((state) => state.playback);

	return (
		<div className={classes.overlayWrapper}>
			{/* <PlayerLoader /> */}
			{player && <ControlsOverlay />}
		</div>
	);
}
