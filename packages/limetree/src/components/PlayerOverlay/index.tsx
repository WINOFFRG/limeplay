import useStore from '../../store';
import ControlsOverlay from '../ControlsOverlay';
import PlayerLoader from '../Loader';
import useStyles from './styles';

export default function PlayerOverlay() {
	const { classes } = useStyles();
	const video = useStore((state) => state.video);
	const shakaPlayer = useStore((state) => state.shakaPlayer);

	if (!video || !shakaPlayer) return null;

	return (
		<div className={classes.overlayWrapper}>
			<PlayerLoader />
			<ControlsOverlay />
		</div>
	);
}
