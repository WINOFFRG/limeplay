import { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';
import { useLimeplayStore } from '@limeplay/core/src/store';
// import PlaybackButton from '../PlaybackButton';
import {
	FullScreenButton,
	PlaybackButton,
	SeekButton,
	VolumeButton,
	useVolume,
} from '@limeplay/core';
import {
	useFullScreen,
	useOrientation,
	usePlayback,
} from '@limeplay/core/src/hooks';
import screenfull from 'screenfull';
import { useRouter } from 'next/router';
import PipButton from '@limeplay/core/src/components/PipButton';
import useStyles from './styles';
// import { VolumeControl } from '../VolumeButton';
// import SettingsButton from '../SettingsButton';
// import PresentationTimeline from '../PresentationTimeline';
import AnimationContainer from './AnimationContainer';
import PlaybackNotification from './PlaybackNotification';
import {
	Forward10,
	FullscreenEnter,
	FullscreenExit,
	MaximizeIcon,
	MinimizeIcon,
	MuteIcon,
	PauseIcon,
	PipEnter,
	PipExit,
	PlayIcon,
	Reverse10,
	UnmuteIcon,
	VolumeHalf,
} from '../Icons/Icons';
// import SeekControl from '../SeekControl';
// import PipButton from '../PipButton';
import { VolumeSlider } from '../Volume/Slider';
import { TimelineSlider } from '../Timeline/Timeline';

function ResizeButton() {
	const isFullScreen = useLimeplayStore((state) => state.isFullScreen);
	const { classes } = useStyles();
	const router = useRouter();
	const isHomePage = useMemo(
		() => router.pathname === '/',
		[router.pathname]
	);
	const playback = useLimeplayStore((state) => state.playback);

	const togglePage = () => {
		const time = playback.currentTime;

		if (!isHomePage) {
			router.push({
				pathname: '/',
				query: { t: time },
			});
		} else {
			router.push({
				pathname: '/player',
				query: { t: time },
			});
		}
	};

	return (
		<button
			type="button"
			aria-label={isFullScreen ? 'Pause' : 'Play'}
			className={classes.controlButton}
			onClick={togglePage}
		>
			{isHomePage ? <MaximizeIcon /> : <MinimizeIcon />}
		</button>
	);
}

export function ControlsTopPanel() {
	const { classes } = useStyles();
	const element = document.getElementById('limeplay-player');
	const elementRef = useRef(element);

	const { lockOrientation, unlockOrientation } = useOrientation({
		onError: (error) => {
			console.error(error);
		},
	});

	const { isFullScreen, api } = useFullScreen({
		elementRef,
	});

	return (
		<div className={classes.controlsTopPanel} role="none">
			<div className={classes.topRightSection}>
				<PipButton
					pipEnterIcon={<PipEnter />}
					pipExitIcon={<PipExit />}
					className={classes.controlButton}
				/>
				<FullScreenButton
					isFullScreen={isFullScreen}
					className={classes.controlButton}
					onClick={() => {
						if (!isFullScreen) {
							api.request(element).then(() => {
								lockOrientation('landscape');
							});
						} else {
							api.exit();
							unlockOrientation();
						}
					}}
				>
					{isFullScreen ? <FullscreenExit /> : <FullscreenEnter />}
				</FullScreenButton>
				<ResizeButton />
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

	const isPlaying = useLimeplayStore((state) => state.isPlaying);
	const playback = useLimeplayStore((state) => state.playback);

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

function VolumeIcon({ volume, muted }: { volume: number; muted: boolean }) {
	if (volume === 0 || muted) return <MuteIcon />;
	if (volume < 0.5) return <VolumeHalf />;
	return <UnmuteIcon />;
}

function SeekControls() {
	const { classes } = useStyles();
	const playback = useLimeplayStore((state) => state.playback);

	return (
		<>
			<SeekButton
				className={classes.controlButton}
				seekType="backward"
				onClick={() => {
					playback.currentTime -= 10;
				}}
			>
				<Reverse10 />
			</SeekButton>
			<SeekButton
				className={classes.controlButton}
				seekType="forward"
				onClick={() => {
					playback.currentTime += 10;
				}}
			>
				<Forward10 />
			</SeekButton>
		</>
	);
}

export function ControlsBottomPanel() {
	const { classes } = useStyles();
	const playback = useLimeplayStore((state) => state.playback);
	const { isPlaying, togglePlayback } = usePlayback({
		playback,
	});

	useEffect(() => {
		const spacePlayback = (e) => {
			if (e.code === 'Space' && playback) {
				togglePlayback();
				e.preventDefault();
			}
		};

		document.addEventListener('keydown', spacePlayback);

		return () => {
			document.removeEventListener('keydown', spacePlayback);
		};
	}, [playback]);

	return (
		<div className={classes.controlsBottomPanelWrapper}>
			<TimelineSlider />
			<div className={classes.controlsBottomPanel}>
				<div className={classes.controlsLeftContainer}>
					<PlaybackButton
						className={classes.controlButton}
						onClick={togglePlayback}
						isPlaying={isPlaying}
					>
						{isPlaying ? <PauseIcon /> : <PlayIcon />}
					</PlaybackButton>
					<SeekControls />
					<VolumeControls />
				</div>
			</div>
		</div>
	);
}

function VolumeControls() {
	const { classes } = useStyles();
	const playback = useLimeplayStore((state) => state.playback);
	const { muted, volume, toggleMute } = useVolume({
		playback,
	});

	return (
		<>
			<VolumeButton
				className={classes.controlButton}
				onClick={toggleMute}
			>
				<VolumeIcon volume={volume} muted={muted} />
			</VolumeButton>
			<VolumeSlider playback={playback} muted={muted} volume={volume} />
		</>
	);
}
