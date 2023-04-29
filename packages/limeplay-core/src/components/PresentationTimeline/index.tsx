// @ts-nocheck
import { memo, useRef } from 'react';
import {
	UserGestureConfig,
	useGesture,
	State,
	FullGestureState,
} from '@use-gesture/react';
import { clamp } from 'lodash';
import ControlButton from 'home/src/components/Player/ControlButton/ControlButton';
import { useLimeplayStore } from '../../store';
import useStyles from './styles';

import HoverContainer from './HoverContainer';
import useBufferInfo from '../../hooks/useBufferInfo';
import { useTimeline } from '../../hooks';
import { buildTimeString } from './utils';

function BufferRangeBar({
	video,
	shakaPlayer,
}: {
	video: HTMLVideoElement;
	shakaPlayer: shaka.Player;
}) {
	const { classes } = useStyles();
	// const bufferInfo = useLimeplayStore((state) => state.bufferInfo);

	return (
		<div
			style={{
				height: '100%',
				width: '100%',
			}}
		>
			{/* {bufferInfo.map((buffer) => (
				<div
					key={`${buffer.start}-${buffer.end}`}
					className={classes.timelineSlider__Buffer}
					style={{
						left: `${buffer.startPosition}%`,
						width: `${buffer.width}%`,
						position: 'absolute',
					}}
				/>
			))} */}
		</div>
	);
}

const MemoizedBufferRangeBar = memo(BufferRangeBar);

export default function PresentationTimeline() {
	const { classes } = useStyles();
	const elementRef = useRef<HTMLDivElement>(null);
	// useTimeline();

	const {
		playback,
		player,
		seekRange,
		duration,
		currentTime,
		currentProgress,
		liveLatency,
		isLive,
		setCurrentProgress,
		setIsSeeking,
	} = useLimeplayStore((state) => ({
		playback: state.playback,
		player: state.player,
		seekRange: state.seekRange,
		currentTime: state.currentTime,
		duration: state.duration,
		currentProgress: state.currentProgress,
		liveLatency: state.liveLatency,
		isLive: state.isLive,
		setCurrentProgress: state._setCurrentProgress,
		setIsSeeking: state._setIsSeeking,
	}));

	const cbFunction = ({
		event,
		elapsedTime,
		pressed,
		buttons,
		down,
		dragging,
		active,
		ctrlKey,
	}: FullGestureState<'drag' | 'move'>) => {
		const step = !ctrlKey ? 10 : 60;

		const rect = event.currentTarget.getBoundingClientRect();
		const newValue = ((event.clientX - rect.left) / rect.width) * 100;
		const clammpedValue = clamp(newValue, 0, 100);
		setCurrentProgress(clammpedValue);

		if (event.type === 'pointerup' || event.type === 'mousedown') {
			playback.currentTime =
				seekRange.start + (duration * clammpedValue) / 100;
		}

		if (event.type === 'keydown') {
			const { key } = event;

			if (key === 'ArrowUp' || key === 'ArrowRight') {
				const lClammpedValue = clamp(
					playback.currentTime + step,
					seekRange.start,
					seekRange.end
				).toFixed(2);

				const progress =
					((playback.currentTime - seekRange.start) /
						(seekRange.end - seekRange.start)) *
					100;

				playback.currentTime = Number(lClammpedValue);

				setCurrentProgress(progress);
			} else if (key === 'ArrowDown' || key === 'ArrowLeft') {
				const lClammpedValue = clamp(
					playback.currentTime - step,
					seekRange.start,
					seekRange.end
				).toFixed(2);

				const progress =
					((playback.currentTime - seekRange.start) /
						(seekRange.end - seekRange.start)) *
					100;

				playback.currentTime = Number(lClammpedValue);

				setCurrentProgress(progress);
			}
		}

		event.preventDefault();
	};

	const onSeekStartHandler = () => setIsSeeking(true);

	const onSeekEndHandler = () => setIsSeeking(false);

	//  need to set for false seeking as well

	const bind = useGesture({
		onDrag: cbFunction,
		onMouseUp: onSeekEndHandler,
		onMouseDown: ({ event }) => {
			setIsSeeking(true);
			cbFunction({ event });
		},
		onKeyDown: onSeekEndHandler,
		onDragStart: onSeekStartHandler,
		onDragEnd: onSeekEndHandler,
	});

	const parsedCurrentTime = Number(
		(player.isLive()
			? duration - liveLatency
			: playback.currentTime
		).toFixed(0)
	);
	const parsedDuration = Number(duration.toFixed(0));

	return (
		<div className={classes.timelineWrrapper}>
			<span>
				{!isLive && buildTimeString(currentTime, duration > 3600)}
				{isLive && (
					<button
						type="button"
						onClick={() => {
							player.goToLive();
						}}
						style={{
							width: 'auto',
						}}
					>
						{seekRange.end - playback.currentTime > 5
							? `-${buildTimeString(
									seekRange.end - playback.currentTime,
									duration > 3600
							  )}`
							: 'LIVE'}
					</button>
				)}
			</span>
			<div
				className={classes.timelineSlider__Container}
				ref={elementRef}
				aria-orientation="horizontal"
				aria-valuemax={parsedDuration}
				aria-valuemin={0}
				aria-valuenow={parsedCurrentTime}
				role="slider"
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
				<div
					aria-label="Seek Time Scrubber"
					aria-valuemax={parsedDuration}
					aria-valuemin={0}
					aria-valuenow={parsedCurrentTime}
					aria-valuetext={`${parsedCurrentTime} of ${duration.toFixed(
						0
					)}`}
					tabIndex={0}
					style={{
						left: `${currentProgress}%`,
						opacity: 1,
					}}
					className={classes.timelineSlider__PlayHead}
				/>
				<HoverContainer forwardRef={elementRef} />
			</div>
			<span>{buildTimeString(duration, duration > 3600)}</span>
		</div>
	);
}
