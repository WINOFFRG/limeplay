import { FullGestureState, useDrag, useGesture } from '@use-gesture/react';
import { useCallback, useState } from 'react';
import { clamp } from '../utils';

interface SliderHandlerConfig {
	min: number;
	max: number;
	orientation?: React.AriaAttributes['aria-orientation'];
	disabled?: boolean;
	dir?: 'ltr' | 'rtl';
	inverted?: boolean;
	step?: number;
	skipStep?: number;
}

interface UseTimelineSliderConfig {
	sliderHandlerConfig: SliderHandlerConfig;
	ref: React.RefObject<HTMLElement>;
	initialValue?: number;
	onDragStart?: (value: number) => void;
	onDrag?: (value: number) => void;
	onDragEnd?: (value: number) => void;
	onPointerEnter?: () => void;
	onPointerMove?: (value: number) => void;
	onPointerLeave?: () => void;
}

export function useSliderEvents({
	sliderHandlerConfig,
	ref,
	initialValue = 0,
	onDragStart,
	onDrag,
	onDragEnd,
	onPointerEnter,
	onPointerMove,
	onPointerLeave,
}: UseTimelineSliderConfig) {
	const [isSliding, setIsSliding] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const [isInside, setIsInside] = useState(false);
	const [isKeying, setIsKeying] = useState(false);
	const [value, setValue] = useState(initialValue);
	const { disabled } = sliderHandlerConfig;

	const dragHandler = ({
		type,
		active,
		xy: [ox, oy],
		event,
		moving,
		dragging,
		hovering,
		ctrlKey,
		shiftKey,
		values,
		overflow,
		movement,
		offset,
	}: FullGestureState<'drag' | 'move' | 'hover'>) => {
		const {
			min,
			max,
			step = 5,
			skipStep = 30,
			orientation: o9n = 'horizontal',
			dir = 'ltr',
			inverted = false,
		} = sliderHandlerConfig;

		const { height, width, top, left } =
			ref.current.getBoundingClientRect();

		let newValue = value;

		if (event instanceof PointerEvent) {
			const clientPosition = o9n === 'vertical' ? oy : ox;
			const sliderSize = o9n === 'vertical' ? height : width;
			const sliderPosition = o9n === 'vertical' ? top : left;

			const relativePosition = clientPosition - sliderPosition;
			const percentage = relativePosition / sliderSize;
			newValue = percentage * (max - min) + min;

			if (inverted || (dir === 'rtl' && o9n === 'horizontal'))
				newValue = max - newValue + min;

			switch (type) {
				case 'pointerdown':
					onDragStart?.(newValue);
					break;
				case 'pointermove': {
					onDrag?.(newValue);
					onPointerMove?.(newValue);
					break;
				}
				case 'pointerup':
					onDragEnd?.(newValue);
					break;
				case 'pointerenter':
					onPointerEnter?.();
					break;
				case 'pointerleave':
					onPointerLeave?.();
					break;
				default:
					break;
			}
		}

		if (event instanceof KeyboardEvent) {
			const isInverted =
				inverted || (dir === 'rtl' && o9n === 'horizontal');
			const stepSize =
				(shiftKey ? skipStep : step) * (isInverted ? -1 : 1);

			if (active) {
				switch (event.key) {
					case 'ArrowLeft':
						newValue -= stepSize;
						break;
					case 'ArrowRight':
						newValue += stepSize;
						break;
					case 'ArrowUp':
						newValue += stepSize;
						break;
					case 'ArrowDown':
						newValue -= stepSize;
						break;
					default:
						break;
				}
			}

			switch (event.type) {
				case 'keydown': {
					onDrag?.(newValue);
					if (!isSliding) {
						onDragStart?.(newValue);
					}
					break;
				}
				case 'keyup':
					onDragEnd?.(newValue);
					break;
				default:
					break;
			}
		}

		newValue = clamp(newValue, min, max);
		setValue(newValue);
		setIsSliding(active);

		return newValue;
	};

	const hoverHandler = useCallback(
		({ hovering, type }: FullGestureState<'hover'>) => {
			setIsHovering(hovering);

			switch (type) {
				case 'pointerenter':
					onPointerEnter?.();
					break;
				case 'pointerleave':
					onPointerLeave?.();
					break;
				default:
					break;
			}
		},
		[onPointerEnter, onPointerLeave]
	);

	useGesture(
		{
			// pointerenter, pointermove, pointerleave
			onDrag: dragHandler,
			onMove: hoverHandler,
			// onHover: hoverHandler,
		},
		{
			target: ref,
			enabled: !disabled,
			drag: {
				bounds: {
					left: sliderHandlerConfig.min,
					right: sliderHandlerConfig.max,
				},
			},
		}
	);

	return {
		value,
		isSliding,
		isHovering,
		isInside,
	};
}
