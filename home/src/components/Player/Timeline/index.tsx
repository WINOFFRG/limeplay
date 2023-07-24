import {
	useLive,
	useTimeline,
	useTimelineDrag,
} from '@limeplay/core/src/hooks';
import { useRef, useCallback, memo, useMemo } from 'react';

import * as Slider from '@radix-ui/react-slider';
import { useLimeplay } from '@limeplay/core';
import { throttle } from 'lodash';
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

export function TimelineSlider() {
	const { classes } = useStyles();
	const elementRef = useRef<HTMLDivElement>(null);

	const { playbackRef, playerRef } = useLimeplay();
	const playback = playbackRef.current;
	const player = playerRef.current;

	const {
		seekRange,
		duration,
		currentTime,
		isLive,
		liveLatency,
		currentProgress,
		updateCurrentTime,
	} = useTimeline({
		updateInterval: 250,
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

	const { events, isSliding, value } = useTimelineDrag({
		sliderHandlerConfig: config,
		onValueChange: updateCurrentTime,
		// onDragStart
		// onDragEnd
		// onDrag
	});

	return (
		<div className={classes.timelineWrrapper}>
			<CurrentTime
				currentTime={isSliding ? value : currentTime}
				duration={duration}
				player={player}
				isLive={isLive}
				liveLatency={isSliding ? value : liveLatency}
			/>
			<Slider.Root
				value={[isSliding ? value : currentTime]}
				className={classes.timelineSlider__Container}
				ref={elementRef}
				{...config}
				{...events()}
				// onValueChange={(value) => {
				// 	const [_currentTime] = value;
				// 	updateCurrentTime(_currentTime);
				// }}
				onDragEnd={() => {
					console.log('onDragEnd');
				}}
			>
				<Slider.Track className={classes.timelineSlider__ProgressBar}>
					<Slider.Range
						className={classes.timelineSlider__DurationBar}
					/>
					{/* <BufferRangeBar playback={playback} player={player} /> */}
				</Slider.Track>
				<Slider.Thumb
					aria-label="Seek Time Scrubber"
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
