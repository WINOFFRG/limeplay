import { memo, useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';

import {
	getChangeValue,
	buildTimeString,
	getClientPosition,
} from './utils/index';

import useStyles from './styles';
import { useLimeplayStore } from '../../store';

interface HoverContainerProps extends LimeplayRequiredProps {
	forwardRef: React.MutableRefObject<HTMLDivElement | undefined>;
}

function HoverContainer({ forwardRef }: HoverContainerProps) {
	const { classes } = useStyles();
	const bubbleRef = useRef<HTMLDivElement>(null);
	const hoverBarRef = useRef<HTMLDivElement>(null);

	const { duration, isLive, seekRange } = useLimeplayStore(
		(state) => ({
			duration: state.duration,
			isLive: state.isLive,
			seekRange: state.seekRange,
		}),
		shallow
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
				duration > 3600
			);

			// setHoverTime(hoverTimeText);

			const dP = isLive
				? 100 - ((seekRange.end - changeValue) / duration) * 100
				: (changeValue / duration) * 100;

			if (bubbleRef.current) {
				bubbleRef.current.innerText = hoverTimeText;
				bubbleRef.current.style.left = `${dP}%`;
			}

			if (hoverBarRef.current) {
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

		const pointerEnterEventHandler = (e: PointerEvent) => {
			if (bubbleRef.current) {
				bubbleRef.current.style.display = 'block';
			}

			if (hoverBarRef.current) {
				hoverBarRef.current.style.display = 'block';
			}
		};

		if (element) {
			element.addEventListener('pointerenter', pointerEnterEventHandler);
			element.addEventListener('pointermove', pointerMoveEventHandler);
			element.addEventListener('pointerleave', pointerLeaveEventHandler);
		}

		hoverBarRef.current.style.display = 'none';
		bubbleRef.current.style.display = 'none';

		return () => {
			if (element) {
				element.removeEventListener(
					'pointerenter',
					pointerEnterEventHandler
				);
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
	}, [forwardRef, bubbleRef, hoverBarRef, duration]);

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

const MemoizedHoverContainer = memo(HoverContainer);

export default MemoizedHoverContainer;
