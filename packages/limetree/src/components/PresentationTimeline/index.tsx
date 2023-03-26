import { memo, useRef } from 'react';
import {
	UserGestureConfig,
	useGesture,
	State,
	FullGestureState,
} from '@use-gesture/react';
import { clamp } from 'lodash';
import { useLimeplayStore } from '../../store';
import useStyles from './styles';

import HoverContainer from './HoverContainer';
import useBufferInfo from '../../hooks/useBufferInfo';
import { useTimeline } from '../../hooks';
import ControlButton from '../ControlButton';
import { buildTimeString } from './utils';

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

	useTimeline();

	const step = 10;

	const cbFunction = ({ event }: FullGestureState<'drag' | 'move'>) => {
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
				playback.currentTime = Number(lClammpedValue);

				setCurrentProgress(
					((playback.currentTime - seekRange.start) /
						(seekRange.end - seekRange.start)) *
						100
				);
			} else if (key === 'ArrowDown' || key === 'ArrowLeft') {
				const lClammpedValue = clamp(
					playback.currentTime - step,
					seekRange.start,
					seekRange.end
				).toFixed(2);
				playback.currentTime = Number(lClammpedValue);

				setCurrentProgress(
					((playback.currentTime - seekRange.start) /
						(seekRange.end - seekRange.start)) *
						100
				);
			}
		}
	};

	const onSeekStartHandler = () => setIsSeeking(true);

	const onSeekEndHandler = () => setIsSeeking(false);

	//  need to set for false seeking as well

	const bind = useGesture(
		{
			onDrag: cbFunction,
			onMouseUp: onSeekEndHandler,
			onMouseDown: ({ event }) => {
				setIsSeeking(true);
				cbFunction({ event });
			},
			onKeyDown: onSeekStartHandler,
			onDragStart: onSeekStartHandler,
			onDragEnd: onSeekEndHandler,
		},
		{
			drag: {
				axis: 'x',
			},
		}
	);

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
				{!isLive && buildTimeString(duration, duration > 3600)}
				{isLive && (
					<ControlButton
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
					</ControlButton>
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
				<ControlButton
					aria-label="Seek Time Scrubber"
					aria-valuemax={parsedDuration}
					aria-valuemin={0}
					aria-valuenow={parsedCurrentTime}
					aria-valuetext={`${parsedCurrentTime} of ${duration.toFixed(
						0
					)}`}
					className={classes.timelineSlider__PlayHead}
					tabIndex={0}
					style={{
						left: `${currentProgress}%`,
						opacity: 1,
					}}
				/>
				<HoverContainer forwardRef={elementRef} />
			</div>
			{buildTimeString(duration, duration > 3600)}
		</div>
	);
}
