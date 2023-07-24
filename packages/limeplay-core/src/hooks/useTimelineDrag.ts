import { FullGestureState, useDrag } from '@use-gesture/react';
import { clamp } from 'lodash';
import { useState } from 'react';

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
	onSlideStart?: (value: number) => void;
	onSlide?: (value: number) => void;
	onSlideEnd?: (value: number) => void;
}

export function useTimelineDrag({
	sliderHandlerConfig,
	ref,
	onSlideStart,
	onSlide,
	onSlideEnd,
}: UseTimelineSliderConfig) {
	const [isSliding, setIsSliding] = useState(false);
	const [value, setValue] = useState(0);
	const { disabled } = sliderHandlerConfig;

	const dragHandler = ({
		type,
		active,
		xy: [ox, oy],
		event,
		ctrlKey,
		shiftKey,
	}: FullGestureState<'drag'>) => {
		setIsSliding(active);

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
					onSlideStart?.(newValue);
					break;
				case 'pointermove':
					onSlide?.(newValue);
					break;
				case 'pointerup':
					onSlideEnd?.(newValue);
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
					onSlideStart?.(newValue);
					onSlide?.(newValue);
					break;
				}
				case 'keyup':
					onSlideEnd?.(newValue);
					break;
				default:
					break;
			}
		}

		newValue = clamp(newValue, min, max);

		setValue(newValue);
		return newValue;
	};

	useDrag(dragHandler, {
		target: ref,
		enabled: !disabled,
	});

	return {
		value,
		isSliding,
	};
}
