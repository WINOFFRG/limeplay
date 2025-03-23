import { useTimelineHover } from '@limeplay/core';
import useStyles from './styles';
import { OnSliderHandlerProps } from '.';
import { buildTimeString } from './utils';

export function HoverContainer({
	sliderRef,
	sliderConfig,
}: {
	sliderRef: React.RefObject<HTMLDivElement>;
	sliderConfig: OnSliderHandlerProps;
}) {
	const { classes } = useStyles();

	const { isHovering, value } = useTimelineHover({
		ref: sliderRef,
		sliderHandlerConfig: sliderConfig,
	});

	if (!isHovering) return null;

	return (
		<div
			style={{
				position: 'absolute',
				top: '25%',
				left: `${(value / sliderConfig.max) * 100}%`,
			}}
		>
			<div className={classes.timelineSlider__VerticalBar__Hover} />
			<div className={classes.timelineSlider__VerticalBarDuration__Hover}>
				{buildTimeString(value, value > 3600)}
			</div>
		</div>
	);
}
