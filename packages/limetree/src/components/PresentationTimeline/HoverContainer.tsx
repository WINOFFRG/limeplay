import { useEffect, useRef, useState } from 'react';
import {
	getChangeValue,
	buildTimeString,
	getClientPosition,
} from './utils/index';

import useStyles from './styles';
import useTimeline from '../../hooks/useTimeline';

interface HoverContainerProps extends LimeplayRequiredProps {
	forwardRef: React.MutableRefObject<HTMLDivElement | undefined>;
}

export default function HoverContainer({
	playback,
	player,
	forwardRef,
}: HoverContainerProps) {
	const { classes } = useStyles();
	const [hoverTime, setHoverTime] = useState<string | null>(null);
	const hoverPos = useRef<number | null>(null);

	const { duration, isLive, seekRange, isHour } = useTimeline(
		playback,
		player
	);

	useEffect(() => {
		const element = forwardRef.current;

		const pointerLeaveEventHandler = (e: PointerEvent) => {
			setHoverTime(null);
		};

		const pointerMoveEventHandler = (e: PointerEvent) => {
			if (!element) return;

			const rect = element.getBoundingClientRect();
			const changePosition = getClientPosition(e);

			const changeValue = getChangeValue({
				value: changePosition - rect.left,
				max: seekRange.end,
				min: seekRange.start,
				step: 0.01,
				containerWidth: rect.width,
			});

			const hoverTimeText = buildTimeString(
				isLive ? seekRange.end - changeValue : changeValue,
				isHour
			);

			setHoverTime(hoverTimeText);

			hoverPos.current = isLive
				? 100 - ((seekRange.end - changeValue) / duration) * 100
				: (changeValue / duration) * 100;
		};

		if (element) {
			element.addEventListener('pointermove', pointerMoveEventHandler);
			element.addEventListener('pointerleave', pointerLeaveEventHandler);
		}

		return () => {
			if (element) {
				element.removeEventListener(
					'pointermove',
					pointerMoveEventHandler
				);
				element.removeEventListener(
					'pointerleave',
					pointerLeaveEventHandler
				);
			}
		};
	}, [player, playback, forwardRef, seekRange]);

	return (
		<>
			<div
				style={{
					display: hoverTime ? 'block' : 'none',
					left: `${hoverPos.current}%`,
				}}
				className={classes.timelineSlider__VerticalBar__Hover}
			/>
			<div
				style={{
					display: hoverTime ? 'block' : 'none',
					left: `${hoverPos.current}%`,
				}}
				className={classes.timelineSlider__VerticalBarDuration__Hover}
			>
				{hoverTime}
			</div>
		</>
	);
}
