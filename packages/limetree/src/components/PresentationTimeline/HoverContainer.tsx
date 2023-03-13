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
	const [hoverTime, setHoverTime] = useState<string | null>('0');
	const hoverPos = useRef<number | null>(null);
	const bubbleRef = useRef<HTMLDivElement>(null);
	const hoverBarRef = useRef<HTMLDivElement>(null);

	const { duration, isLive, seekRange, isHour } = useTimeline(
		playback,
		player
	);

	useEffect(() => {
		const element = forwardRef.current;

		const pointerLeaveEventHandler = (e: PointerEvent) => {
			if (bubbleRef.current) bubbleRef.current.style.display = 'none';
			if (hoverBarRef.current) hoverBarRef.current.style.display = 'none';
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

			// setHoverTime(hoverTimeText);

			const dP = isLive
				? 100 - ((seekRange.end - changeValue) / duration) * 100
				: (changeValue / duration) * 100;

			if (bubbleRef.current) {
				bubbleRef.current.style.display = 'block';
				bubbleRef.current.innerText = hoverTimeText;
				bubbleRef.current.style.left = `${dP}%`;
			}

			if (hoverBarRef.current) {
				hoverBarRef.current.style.display = 'block';
				hoverBarRef.current.style.left = `${dP}%`;
			}
		};

		/*
            It is important that we add listeners on these elements in react way, 
            since the component rerenders everytime mouse is moved it causes a 
            huge impact. I checked with Chrome performance monitor tools, whenever 
            mouse was hovered the number of listeners increased exponentially as 
            everytime the component renders onPointerMove and onPointerLeave events 
            were added. 
        */

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
	}, [player, playback, forwardRef, seekRange, bubbleRef, hoverBarRef]);

	return (
		<>
			<div
				ref={hoverBarRef}
				className={classes.timelineSlider__VerticalBar__Hover}
			/>
			<div
				ref={bubbleRef}
				className={classes.timelineSlider__VerticalBarDuration__Hover}
			/>
		</>
	);
}
