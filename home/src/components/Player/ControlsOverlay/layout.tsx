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
	usePiP,
	usePlayback,
} from '@limeplay/core/src/hooks';
import screenfull from 'screenfull';
import { useRouter } from 'next/router';
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
	NfPauseIcon,
	NfPlayIcon,
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

function ResizeButton({ isFullScreen }: { isFullScreen: boolean }) {
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
	const playback = useLimeplayStore((state) => state.playback);
	const player = useLimeplayStore((state) => state.player);

	const { lockOrientation, unlockOrientation, orientation } = useOrientation({
		onError: (error) => {
			console.error(error);
		},
		onChange: (event) => {
			if (orientation.type.includes('landscape') && !isFullScreen) {
				enterFullScreen();
			} else if (orientation.type.includes('portrait') && isFullScreen) {
				exitFullScreen();
			}
		},
	});

	const {
		isFullScreen,
		toggleFullScreen,
		isFullScreenSupported,
		enterFullScreen,
		exitFullScreen,
	} = useFullScreen({
		elementRef,
		playback: playback as HTMLVideoElement,
		onEnter: () => {
			lockOrientation('landscape');
		},
		onExit: unlockOrientation,
		onError: (error) => {
			console.error('Hook: ', error);
		},
	});

	const { isPiPActive, isPiPAllowed, togglePiP } = usePiP({
		playback: playback as HTMLVideoElement,
	});

	return (
		<div className={classes.controlsTopPanel} role="none">
			<div className={classes.topRightSection}>
				<button
					type="button"
					className={classes.controlButton}
					onClick={togglePiP}
					disabled={!isPiPAllowed}
				>
					{isPiPActive ? <PipExit /> : <PipEnter />}
				</button>
				<FullScreenButton
					disabled={!isFullScreenSupported}
					isFullScreen={isFullScreen}
					className={classes.controlButton}
					onClick={toggleFullScreen}
				>
					{isFullScreen ? <FullscreenExit /> : <FullscreenEnter />}
				</FullScreenButton>
				<ResizeButton isFullScreen={isFullScreen} />
			</div>
		</div>
	);
}

export function ControlsMiddlePanel() {
	const { classes } = useStyles();
	const cuesContainer = useRef<HTMLDivElement>(null);
	const timeout = useRef<number>(0);
	const [playAnim, setPlayAnim] = useState(false);
	const [pauseAnim, setPauseAnim] = useState(false);

	const playback = useLimeplayStore((state) => state.playback);

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
	}, [playback, togglePlayback]);

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
			<VolumeSlider playback={playback} volume={volume} />
		</>
	);
}
