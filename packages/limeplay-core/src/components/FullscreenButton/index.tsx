import { useLimeplayStore } from '../../store';
import useFullScreen from '../../hooks/useFullScreen';

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<'button'>;

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
