import { useEffect, useRef, useState } from 'react';
import { useLimeplayStore } from '@limeplay/core/src/store';
// import PlaybackButton from '../PlaybackButton';
import useStyles from './styles';
// import { VolumeControl } from '../VolumeButton';
// import SettingsButton from '../SettingsButton';
// import PresentationTimeline from '../PresentationTimeline';
import AnimationContainer from './AnimationContainer';
import PlaybackNotification from './PlaybackNotification';
import {
	Forward10,
	MuteIcon,
	PauseIcon,
	PipEnter,
	PipExit,
	PlayIcon,
	Reverse10,
	UnmuteIcon,
	VolumeHalf,
} from '../Icons';
// import SeekControl from '../SeekControl';
// import PipButton from '../PipButton';
import { VolumeSlider } from '../VolumeSlider/Slider';

export function ControlsTopPanel() {
	const { classes } = useStyles();

	return (
		<div className={classes.controlsTopPanel} role="none">
			<div className={classes.topRightSection}>
				{/* <PipButton
					pipEnterIcon={<PipEnter />}
					pipExitIcon={<PipExit />}
				/> */}
			</div>
		</div>
	);
}

function NfPlayIcon() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="Hawkins-Icon Hawkins-Icon-Standard "
		>
			<path
				d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function NfPauseIcon() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="Hawkins-Icon Hawkins-Icon-Standard "
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4.5 3C4.22386 3 4 3.22386 4 3.5V20.5C4 20.7761 4.22386 21 4.5 21H9.5C9.77614 21 10 20.7761 10 20.5V3.5C10 3.22386 9.77614 3 9.5 3H4.5ZM14.5 3C14.2239 3 14 3.22386 14 3.5V20.5C14 20.7761 14.2239 21 14.5 21H19.5C19.7761 21 20 20.7761 20 20.5V3.5C20 3.22386 19.7761 3 19.5 3H14.5Z"
				fill="currentColor"
			/>
		</svg>
	);
}

export function ControlsMiddlePanel() {
	const { classes } = useStyles();
	const cuesContainer = useRef<HTMLDivElement>(null);
	const timeout = useRef<number>(0);
	const [playAnim, setPlayAnim] = useState(false);
	const [pauseAnim, setPauseAnim] = useState(false);

	const { isPlaying, playback } = useLimeplayStore((state) => ({
		isPlaying: state.isPlaying,
		playback: state.playback,
	}));

	useEffect(() => {
		if (isPlaying) {
			setPlayAnim(true);
			window.setTimeout(() => {
				setPlayAnim(false);
			}, 500);
		}
		if (!isPlaying) {
			setPauseAnim(true);
			window.setTimeout(() => {
				setPauseAnim(false);
			}, 500);
		}

		return () => {
			clearTimeout(timeout.current);
		};
	}, [isPlaying]);

	return (
		<div
			ref={cuesContainer}
			className={classes.controlsMiddlePanel}
			role="none"
			onClick={() => {
				if (playback) {
					if (playback.paused) playback.play();
					else playback.pause();
				}
			}}
		>
			{playAnim && (
				<PlaybackNotification>
					<NfPlayIcon />
				</PlaybackNotification>
			)}
			{pauseAnim && (
				<PlaybackNotification>
					<NfPauseIcon />
				</PlaybackNotification>
			)}
			{/* {isPlaying && <AnimationContainer />} */}
			{/* <div className={classes.centrePlaybackIcon}>
				<PlayIcon />
			</div> */}
		</div>
	);
}

export function ControlsBottomPanel() {
	const { classes } = useStyles();

	return (
		<div className={classes.controlsBottomPanelWrapper}>
			{/* <PresentationTimeline /> */}
			<div className={classes.controlsBottomPanel}>
				<div className={classes.controlsLeftContainer}>
					{/* <PlaybackButton
						playIcon={<PlayIcon />}
						pauseIcon={<PauseIcon />}
					/>
					<SeekControl seekIcon={<Reverse10 />} type="backward" />
					<SeekControl seekIcon={<Forward10 />} type="forward" /> */}
					<VolumeControl
						muteIcon={<MuteIcon />}
						volumeHalfIcon={<VolumeHalf />}
						volumeFullIcon={<UnmuteIcon />}
					/>
					<VolumeSlider />
				</div>
			</div>
		</div>
	);
}
