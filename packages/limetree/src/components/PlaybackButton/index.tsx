import useStore from '../../store';
import useStyles from './styles';
import usePlayback from '../../hooks/usePlayback';

export function PlayIcon() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
		>
			<path
				d="M4.245 2.563a.5.5 0 00-.745.435v18.004a.5.5 0 00.745.435l15.997-9.001a.5.5 0 000-.872L4.245 2.563z"
				fill="#FFF"
				stroke="#FFF"
				fillRule="evenodd"
			/>
		</svg>
	);
}

export function PauseIcon() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
		>
			<path
				d="M18 2.5A1.5 1.5 0 0016.5 4v16a1.5 1.5 0 003 0V4A1.5 1.5 0 0018 2.5zm-12 0A1.5 1.5 0 004.5 4v16a1.5 1.5 0 003 0V4A1.5 1.5 0 006 2.5z"
				fill="#FFF"
				stroke="#FFF"
				fillRule="evenodd"
			/>
		</svg>
	);
}

export default function PlaybackButton() {
	const { classes } = useStyles();
	const video = useStore((state) => state.video);

	const isLoading = useStore((state) => state.isLoading);
	// @ts-ignore
	const { isPlaying, togglePlayback } = usePlayback(video);

	return (
		<button
			type="button"
			disabled={isLoading}
			className={classes.controlButton}
			onClick={togglePlayback}
		>
			{!isPlaying ? <PlayIcon /> : <PauseIcon />}
		</button>
	);
}
