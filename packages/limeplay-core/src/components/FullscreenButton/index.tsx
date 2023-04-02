import { useLimeplayStore } from '../../store';
import useStyles from './styles';
import useFullScreen from '../../hooks/useFullScreen';
import { FullscreenEnter, FullscreenExit } from '../Icons';

export default function FullscreenButton() {
	const { classes } = useStyles();
	const playerBaseWrapper = useLimeplayStore((state) => state.playback);
	// @ts-ignore
	const { isFullscreen, toggleFullscreen } = useFullScreen(playerBaseWrapper);

	return (
		<button
			className={classes.controlButton}
			onClick={toggleFullscreen}
			type="button"
		>
			{isFullscreen ? <FullscreenExit /> : <FullscreenEnter />}
		</button>
	);
}
