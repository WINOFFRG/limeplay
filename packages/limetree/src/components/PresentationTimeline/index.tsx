import { memo, useRef } from 'react';
import { useGesture } from '@use-gesture/react';
import { clamp } from 'lodash';
import { useLimeplayStore } from '../../store';
import useStyles from './styles';

import HoverContainer from './HoverContainer';
import useBufferInfo from '../../hooks/useBufferInfo';
import { useTimeline } from '../../hooks';
import ControlButton from '../ControlButton';

function BufferRangeBar({
	video,
	shakaPlayer,
}: {
	video: HTMLVideoElement;
	shakaPlayer: shaka.Player;
}) {
	const { classes } = useStyles();
	const bufferInfo = useStore((state) => state.bufferInfo);

	return (
		<div
			style={{
				height: '100%',
				width: '100%',
			}}
		>
			{bufferInfo.map((buffer) => (
				<div
					key={`${buffer.start}-${buffer.end}`}
					className={classes.timelineSlider__Buffer}
					style={{
						left: `${buffer.startPosition}%`,
						width: `${buffer.width}%`,
						position: 'absolute',
					}}
				/>
			))}
		</div>
	);
}

const MemoizedBufferRangeBar = memo(BufferRangeBar);

export default function PresentationTimeline() {
	const { classes } = useStyles();
	const elementRef = useRef<HTMLDivElement>(null);

	const {
		playback,
		player,
		seekRange,
		duration,
		currentProgress,
		setCurrentProgress,
		setIsSeeking,
	} = useLimeplayStore((state) => ({
		playback: state.playback,
		player: state.player,
		seekRange: state.seekRange,
		duration: state.duration,
		currentProgress: state.currentProgress,
		setCurrentProgress: state._setCurrentProgress,
		setIsSeeking: state._setIsSeeking,
	}));

	useTimeline();

	const cbFunction = ({ event }) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const newValue = ((event.clientX - rect.left) / rect.width) * 100;
		const clammpedValue = clamp(newValue, 0, 100);
		setCurrentProgress(clammpedValue);

		if (event.type === 'pointerup' || event.type === 'mousedown') {
			playback.currentTime =
				seekRange.start + (duration * clammpedValue) / 100;
		}
	};

	const bind = useGesture(
		{
			onDrag: cbFunction,
			onMouseUp: () => {
				setIsSeeking(false);
			},
			onMouseDown: ({ event }) => {
				setIsSeeking(true);
				cbFunction({ event });
			},
		},
		{
			drag: {
				axis: 'x',
				filterTaps: false,
			},
			enabled: playback.readyState > 2,
		}
	);

	return (
		<div
			className={classes.timelineSlider__Container}
			ref={elementRef}
			aria-orientation="horizontal"
			aria-valuemax={Number(duration.toFixed(0))}
			aria-valuemin={0}
			aria-valuenow={Number(playback.currentTime.toFixed(0))}
			role="slider"
			tabIndex={-1}
			{...bind()}
		>
			<div className={classes.timelineSlider__ProgressBar}>
				<div className={classes.timelineSlider__DurationBar} />
				<div
					className={classes.timelineSlider__DurationPlayed}
					style={{
						width: `${currentProgress}%`,
					}}
				/>
				{/* <MemoizedBufferRangeBar
					video={video}
					shakaPlayer={shakaPlayer}
				/> */}
			</div>
			<ControlButton
				aria-label="Seek Time Scrubber"
				aria-valuemax={Number(duration.toFixed(0))}
				aria-valuemin={0}
				aria-valuenow={Number(playback.currentTime.toFixed(0))}
				aria-valuetext={`${playback.currentTime.toFixed(
					0
				)} of ${duration.toFixed(0)}`}
				className={classes.timelineSlider__PlayHead}
				tabIndex={0}
				style={{
					left: `${currentProgress}%`,
					opacity: 1,
				}}
			>
				{/* <div
					className={classes.timelineSlider__PlayHead}
					style={{
						left: `${currentProgress}%`,
					}}
				/> */}
			</ControlButton>
			<HoverContainer forwardRef={elementRef} />
		</div>
	);
}
