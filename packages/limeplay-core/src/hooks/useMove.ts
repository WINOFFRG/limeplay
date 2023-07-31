import { useMove } from '@use-gesture/react';
import { clamp } from 'lodash';

type Direction = 'ltr' | 'rtl';

type OnSliderHandlerProps = {
	min: number;
	max: number;
	step: number;
	orientation: React.AriaAttributes['aria-orientation'];
	disabled: boolean;
	dir: Direction;
	inverted: boolean;
};

export function useSliderMove(
	event: React.MouseEvent<HTMLElement>,
	callback: (value: number) => void,
	props: OnSliderHandlerProps
): number {
	const { min, max, step, orientation: o9n, dir, inverted, disabled } = props;

	if (disabled) return null;

	const clientPosition = o9n === 'vertical' ? event.clientY : event.clientX;

	const rect = event.currentTarget.getBoundingClientRect();

	const sliderSize = o9n === 'vertical' ? rect.height : rect.width;

	// Get the position of the slider
	const sliderPosition = o9n === 'vertical' ? rect.top : rect.left;

	// Calculate the position of the event relative to the slider
	const relativePosition = clientPosition - sliderPosition;

	// Calculate the percentage of the slider the event is at
	const percentage = relativePosition / sliderSize;

	// Calculate the new value based on the percentage
	let newValue = percentage * (max - min) + min;

	// Invert the volume if necessary
	if (inverted || (dir === 'rtl' && o9n === 'horizontal'))
		newValue = max - newValue + min;

	newValue = clamp(newValue, min, max);

	return newValue;
}
