import {
	FullGestureState,
	UserDragConfig,
	useDrag,
	useGesture,
	useMove,
} from '@use-gesture/react';
import { clamp } from 'lodash';
import { useCallback, useState } from 'react';

interface SliderHandlerConfig {
	min: number;
	max: number;
	step: number;
	orientation: React.AriaAttributes['aria-orientation'];
	disabled: boolean;
	dir: 'ltr' | 'rtl';
	inverted: boolean;
}

interface UseTimelineSliderConfig {
	sliderHandlerConfig: SliderHandlerConfig;
	onValueChange?: (value: number) => void;
}

export function useTimelineDrag({
	sliderHandlerConfig,
	onValueChange,
}: UseTimelineSliderConfig) {
	const [isSliding, setIsSliding] = useState(false);
	const [value, setValue] = useState(0);

	const cbFunction = ({
		event,
		active,
		type,
		movement,
		xy: [x, y],
		currentTarget,
	}: FullGestureState<'drag'>) => {
		setIsSliding(active);

		const {
			min,
			max,
			step,
			orientation: o9n,
			dir,
			inverted,
			disabled,
		} = sliderHandlerConfig;
		if (disabled) return null;

		console.log(
			event.clientX,
			event.clientY,
			x,
			y,
			currentTarget.clientHeight
		);

		const clientPosition = o9n === 'vertical' ? y : x;
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

		console.log({ event: event.type, newValue, active });

		// if (onValueChange) onValueChange(newValue);

		setValue(newValue);

		return newValue;
	};

	const events: any = useDrag(cbFunction);

	return {
		value,
		events,
		isSliding,
	};
}
