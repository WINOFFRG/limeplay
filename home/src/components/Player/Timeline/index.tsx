import {
	useSliderEvents,
	useTimeline,
	useTimelineDrag,
} from '@limeplay/core/src/hooks';
import { useRef } from 'react';

import * as Slider from '@radix-ui/react-slider';
import { useLimeplay } from '@limeplay/core';
import { buildTimeString } from './utils';
import useStyles from './styles';
import { CurrentTime } from './CurrentTime';
import { HoverContainer } from './HoverContainer';

export type OnSliderHandlerProps = {
	min: number;
	max: number;
	step: number;
	orientation: React.AriaAttributes['aria-orientation'];
	disabled: boolean;
	dir: 'ltr' | 'rtl';
	inverted: boolean;
	skipSize?: number;
};

export function TimelineSlider() {
	const { classes } = useStyles();
	const elementRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const { playbackRef, playerRef } = useLimeplay();
	const player = playerRef.current;

	const {
		seekRange,
		duration,
		currentTime,
		isLive,
		liveLatency,
		updateCurrentTime,
	} = useTimeline({
		updateInterval: 250,
	});

	const config: OnSliderHandlerProps = {
		min: seekRange.start,
		max: seekRange.end,
		step: 5,
		orientation: 'horizontal',
		disabled: false,
		dir: 'ltr',
		inverted: false,
	};

	const { isSliding, value } = useSliderEvents({
		sliderHandlerConfig: config,
		onDragEnd: updateCurrentTime,
		ref: elementRef,
	});

	return (
		<div className={classes.timelineWrrapper} ref={containerRef}>
			<CurrentTime
				currentTime={currentTime}
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
				<HoverContainer sliderRef={elementRef} sliderConfig={config} />
			</Slider.Root>
			<span>{buildTimeString(duration, duration > 3600)}</span>
		</div>
	);
}
