import {
	FullGestureState,
	useDrag,
	useGesture,
	useHover,
	useMove,
} from '@use-gesture/react';
import { useState } from 'react';
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

interface UseTimelineSliderHoverConfig {
	sliderHandlerConfig: SliderHandlerConfig;
	ref: React.RefObject<HTMLElement>;
	onSlideStart?: (value: number) => void;
	onSlide?: (value: number) => void;
	onSlideEnd?: (value: number) => void;
}

export function useTimelineHover({
	sliderHandlerConfig,
	ref,
	onSlideStart,
	onSlide,
	onSlideEnd,
}: UseTimelineSliderHoverConfig) {
	const [isHovering, setIsHovering] = useState(false);
	const [value, setValue] = useState(0);
	const { disabled } = sliderHandlerConfig;

	const dragHandler = ({
		active,
		xy: [ox, oy],
		event,
	}: FullGestureState<'hover'>) => {
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
		}

		newValue = clamp(newValue, min, max);

		setValue(newValue);
		return newValue;
	};

	useHover(
		({ hovering }: FullGestureState<'hover'>) => {
			setIsHovering(hovering);
		},
		{
			target: ref,
			enabled: !disabled,
		}
	);

	useMove(dragHandler, {
		target: ref,
		enabled: !disabled,
	});

	return {
		value,
		isHovering,
	};
}
