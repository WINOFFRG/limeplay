import { useTimeline } from '@limeplay/core/src/hooks';
import { useRef } from 'react';
import { useLimeplayStore } from '@limeplay/core/src/store';
import { FullGestureState, useDrag } from '@use-gesture/react';
import * as Slider from '@radix-ui/react-slider';
import { buildTimeString } from './utils';
import useStyles from './styles';
import ControlButton from '../ControlButton';

export function TimelineSlider() {
	const { classes } = useStyles();
	const elementRef = useRef<HTMLDivElement>(null);

	const playback = useLimeplayStore((state) => state.playback);
	const player = useLimeplayStore((state) => state.player);
	const {
		seekRange,
		duration,
		currentTime,
		currentProgress,
		liveLatency,
		isLive,
		isSeeking,
		setCurrentProgress,
		setIsSeeking,
	} = useTimeline({
		playback,
		player,
	});

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
		setIsSeeking(active);

		// setCurrentProgress(clammpedValue);

		if (event.type === 'pointermove' || event.type === 'pointerdown') {
			// @ts-ignore
			// const newTime = onSlideHandler(event, config);
			// playback.currentTime = seekRange.start + newTime * duration;
			// setCurrentProgress(newTime * 100);
		}
	};

	if (!playback || !player) return null;

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
			<Slider.Root
				// value={[currentTime]}
				className={classes.timelineSlider__Container}
				ref={elementRef}
				min={seekRange.start}
				max={seekRange.end}
				onValueChange={(e) => {
					[playback.currentTime] = e;
				}}
			>
				<Slider.Track className={classes.timelineSlider__ProgressBar}>
					<Slider.Range
						className={classes.timelineSlider__DurationBar}
					/>
					{/* <BufferRangeBar /> */}
				</Slider.Track>
				<Slider.Thumb
					aria-label="Seek Time Scrubber"
					aria-valuemax={parsedDuration}
					aria-valuemin={0}
					aria-valuenow={parsedCurrentTime}
					aria-valuetext={`${parsedCurrentTime} of ${duration.toFixed(
						0
					)}`}
					tabIndex={0}
					className={classes.timelineSlider__PlayHead}
				/>
				{/* <MemoizedHoverContainer
					forwardRef={elementRef}
					playback={playback}
					player={player}
				/> */}
			</Slider.Root>
			<span>{buildTimeString(duration, duration > 3600)}</span>
		</div>
	);
}
