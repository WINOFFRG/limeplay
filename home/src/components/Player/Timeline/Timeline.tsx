import { useLive, useTimeline } from '@limeplay/core/src/hooks';
import { useRef, useCallback } from 'react';
import { useLimeplayStore } from '@limeplay/core/src/store';
import { FullGestureState, useDrag, useMove } from '@use-gesture/react';
import * as Slider from '@radix-ui/react-slider';
import { clamp } from 'lodash';
import { buildTimeString } from './utils';
import useStyles from './styles';
import { CurrentTime } from './CurrentTime';
import { BufferRangeBar } from './Buffer';

type OnSliderHandlerProps = {
	min: number;
	max: number;
	step: number;
	orientation: React.AriaAttributes['aria-orientation'];
	disabled: boolean;
	dir: 'ltr' | 'rtl';
	inverted: boolean;
};

function onSlideHandler(
	event: React.MouseEvent<HTMLElement>,
	props: OnSliderHandlerProps
): number {
	const { min, max, step, orientation: o9n, dir, inverted, disabled } = props;
	if (disabled) return null;
	const clientPosition = o9n === 'vertical' ? event.clientY : event.clientX;
	const rect = event.currentTarget.getBoundingClientRect();

	const sliderSize =
		o9n === 'vertical'
			? event.currentTarget.clientHeight
			: event.currentTarget.clientWidth;

	const sliderPosition = o9n === 'vertical' ? rect.top : rect.left;
	const relativePosition = clientPosition - sliderPosition;
	const percentage = relativePosition / sliderSize;
	let newValue = percentage * (max - min) + min;
	if (inverted || (dir === 'rtl' && o9n === 'horizontal'))
		newValue = max - newValue + min;

	newValue = clamp(newValue, min, max);

	return newValue;
}

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
		isSeeking,
		setCurrentProgress,
		setIsSeeking,
		setCurrentTime,
	} = useTimeline({
		playback,
		player,
		updateInterval: 500,
	});

	const { isLive, liveLatency } = useLive({
		playback,
		player,
		updateInterval: 500,
	});

	const config: OnSliderHandlerProps = {
		min: seekRange.start,
		max: seekRange.end,
		step: 0.05,
		orientation: 'horizontal',
		disabled: false,
		dir: 'ltr',
		inverted: false,
	};

	const cbFunction = useCallback(
		({ event, active }: FullGestureState<'drag' | 'move'>) => {
			setIsSeeking(active);

			// setCurrentProgress(clammpedValue);

			if (event.type === 'pointermove' || event.type === 'pointerdown') {
				// @ts-ignore
				const newTime = onSlideHandler(event, config);
				const playbackTime = seekRange.start + newTime * duration;
				console.log({ newTime });
				playback.currentTime = newTime;
				// setCurrentProgress(newTime * 100);
				setCurrentTime(newTime);
			}

			event.preventDefault();
		},
		[playback, duration, seekRange]
	);

	const events: any = useDrag(cbFunction);

	if (!playback || !player) return null;

	// console.log({
	// 	liveLatency,
	// 	currentProgress,
	// 	currentTime,
	// 	duration,
	// 	isLive,
	// 	seekRange,
	// });

	return (
		<div className={classes.timelineWrrapper}>
			<CurrentTime
				currentTime={currentTime}
				duration={duration}
				isLive
				playback={playback}
				player={player}
				seekRange={seekRange}
			/>
			<Slider.Root
				value={[currentTime]}
				className={classes.timelineSlider__Container}
				ref={elementRef}
				// {...events()}
				{...config}
				step={10}
				onValueChange={(value) => {
					playback.currentTime = value[0];
					setCurrentTime(value[0]);
				}}
			>
				<Slider.Track className={classes.timelineSlider__ProgressBar}>
					<Slider.Range
						className={classes.timelineSlider__DurationBar}
					/>
					<BufferRangeBar playback={playback} player={player} />
				</Slider.Track>
				{/* <Slider.Thumb
					aria-label="Seek Time Scrubber"
					tabIndex={0}
					className={classes.timelineSlider__PlayHead}
				/> */}
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
