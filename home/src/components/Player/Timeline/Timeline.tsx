import {
	OnSliderHandlerProps,
	SliderRange,
	SliderRoot,
	SliderThumb,
	SliderTrack,
	onSlideHandler,
} from '@limeplay/core';
import { useTimeline } from '@limeplay/core/src/hooks';
import { useRef } from 'react';
import { useLimeplayStore } from '@limeplay/core/src/store';
import { FullGestureState, useDrag } from '@use-gesture/react';
import { buildTimeString } from './utils';
import useStyles from './styles';
import MemoizedHoverContainer from './HoverContainer';

export function TimelineSlider() {
	const { classes } = useStyles();
	const elementRef = useRef<HTMLDivElement>(null);
	useTimeline();

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

	const config: OnSliderHandlerProps = {
		min: 0,
		max: 1,
		step: 10,
		orientation: 'horizontal',
		disabled: false,
		dir: 'ltr',
		inverted: false,
	};

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
			const newTime = onSlideHandler(event, config);
			playback.currentTime = seekRange.start + newTime * duration;
			return setCurrentProgress(newTime * 100);
		}

		// if (event.type === 'keydown') {
		// 	const { key } = event;

		// 	if (key === 'ArrowUp' || key === 'ArrowRight') {
		// 		const lClammpedValue = clamp(
		// 			playback.currentTime + step,
		// 			seekRange.start,
		// 			seekRange.end
		// 		).toFixed(2);

		// 		const progress =
		// 			((playback.currentTime - seekRange.start) /
		// 				(seekRange.end - seekRange.start)) *
		// 			100;

		// 		playback.currentTime = Number(lClammpedValue);

		// 		setCurrentProgress(progress);
		// 	} else if (key === 'ArrowDown' || key === 'ArrowLeft') {
		// 		const lClammpedValue = clamp(
		// 			playback.currentTime - step,
		// 			seekRange.start,
		// 			seekRange.end
		// 		).toFixed(2);

		// 		const progress =
		// 			((playback.currentTime - seekRange.start) /
		// 				(seekRange.end - seekRange.start)) *
		// 			100;

		// 		playback.currentTime = Number(lClammpedValue);

		// 		setCurrentProgress(progress);
		// 	}
		// }

		event.preventDefault();
	};

	//  need to set for false seeking as well

	const bind: any = useDrag(cbFunction);

	const parsedCurrentTime = Number(
		(player.isLive()
			? duration - liveLatency
			: playback.currentTime
		).toFixed(0)
	);
	const parsedDuration = Number(duration.toFixed(0));

	return (
		<div className={classes.timelineWrrapper}>
			<SliderRoot
				className={classes.timelineSlider__Container}
				ref={elementRef}
				// aria-orientation="horizontal"
				// aria-valuemax={parsedDuration}
				// aria-valuemin={0}
				// aria-valuenow={parsedCurrentTime}
				// role="slider"
				{...bind()}
				{...config}
				value={currentProgress / 100}
			>
				<SliderTrack className={classes.timelineSlider__ProgressBar}>
					<SliderRange
						className={classes.timelineSlider__DurationBar}
						// style={{
						// 	width: `${currentProgress}%`,
						// }}
					/>
					{/* <MemoizedBufferRangeBar
				video={video}
				shakaPlayer={shakaPlayer}
			/> */}
				</SliderTrack>
				<SliderThumb
					aria-label="Seek Time Scrubber"
					aria-valuemax={parsedDuration}
					aria-valuemin={0}
					aria-valuenow={parsedCurrentTime}
					aria-valuetext={`${parsedCurrentTime} of ${duration.toFixed(
						0
					)}`}
					tabIndex={0}
					// style={{
					// 	left: `${currentProgress}%`,
					// 	opacity: 1,
					// }}
					className={classes.timelineSlider__PlayHead}
				/>
				<MemoizedHoverContainer
					forwardRef={elementRef}
					playback={playback}
					player={player}
				/>
			</SliderRoot>
			<span>{buildTimeString(duration, duration > 3600)}</span>
		</div>
	);
}
