import { createContext, forwardRef, useContext, useMemo, useRef } from 'react';
import { clamp } from 'lodash';
import { DragState, useDrag } from '@use-gesture/react';
import { useLimeplayStore } from '../../store';
import { useVolume } from '../../hooks';
import useStyles from './styles';
import { useComposedRefs } from '../../hooks/compose-refs';

type Direction = 'ltr' | 'rtl';
type Side = 'top' | 'right' | 'bottom' | 'left';
type Size = 'width' | 'height';
type SlideDirection = 'from-left' | 'from-right' | 'from-bottom' | 'from-top';

type Config = {
	[key in SlideDirection]: {
		axis: 'x' | 'y';
		size: Size;
		startEdge: Side;
		transform: string;
	};
};

const config: Config = {
	'from-left': {
		axis: 'x',
		size: 'width',
		startEdge: 'left',
		transform: 'translateX(-50%)',
	},
	'from-right': {
		axis: 'x',
		size: 'width',
		startEdge: 'right',
		transform: 'translateX(50%)',
	},
	'from-bottom': {
		axis: 'y',
		size: 'height',
		startEdge: 'bottom',
		transform: 'translateY(50%)',
	},
	'from-top': {
		axis: 'y',
		size: 'height',
		startEdge: 'top',
		transform: 'translateY(-50%)',
	},
};

interface SliderContextValue {
	disabled?: boolean;
	min: number;
	max: number;
	orientation: SliderProps['orientation'];
	startEdge: Side;
	size: Size;
	value: number;
	dir: Direction;
}

const Slider = createContext<SliderContextValue | undefined>(undefined);

/* -------------------------------------------------------------------------------------------------
 * Slider
 * -----------------------------------------------------------------------------------------------*/

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
	name?: string;
	disabled?: boolean;
	orientation?: React.AriaAttributes['aria-orientation'];
	dir?: Direction;
	min?: number;
	max?: number;
	step?: number;
	value?: number;
	defaultValue?: number;
	onValueChange?(value: number): void;
	children?: React.ReactNode;
	style?: React.CSSProperties;
	volume?: number;
	inverted?: boolean;
}

const SliderRoot = forwardRef<HTMLDivElement, SliderProps>(
	(
		{
			name,
			disabled,
			orientation,
			dir = 'ltr',
			min,
			max,
			step,
			value,
			defaultValue,
			onValueChange,
			children,
			style,
			volume,
			inverted,
			...others
		},
		forwardedRef
	) => {
		const ref = useRef<HTMLDivElement>(null);
		const composedRefs = useComposedRefs(forwardedRef, ref);

		let configType: SlideDirection = 'from-left';

		if (orientation === 'vertical') {
			if (inverted) {
				configType = 'from-bottom';
			} else {
				configType = 'from-top';
			}
		} else if (orientation === 'horizontal') {
			if (inverted) {
				configType = 'from-right';
			} else {
				configType = 'from-left';
			}
		}

		const { axis, size, startEdge, transform } = config[configType];

		const context: SliderContextValue = useMemo(
			() => ({
				min,
				max,
				disabled,
				orientation,
				value,
				startEdge,
				size,
				dir,
			}),
			[min, max, disabled, orientation, inverted]
		);

		return (
			<Slider.Provider value={context}>
				<div
					{...others}
					style={{
						...style,
						['--volume-slider-progress' as string]: `${
							volume * 100
						}%`,
						['--volume-slider_thumb-transform' as string]:
							transform,
					}}
					data-disabled={disabled ? '' : undefined}
					data-orientation={orientation}
					ref={composedRefs}
				>
					{children}
				</div>
			</Slider.Provider>
		);
	}
);

/* -------------------------------------------------------------------------------------------------
 * SliderTrack
 * -----------------------------------------------------------------------------------------------*/

type SliderTrackProps = React.HTMLAttributes<HTMLSpanElement>;

const SliderTrack = forwardRef<HTMLSpanElement, SliderTrackProps>(
	({ children, ...trackProps }, forwardedRef) => {
		const { orientation, disabled } = useContext(Slider);
		const ref = useRef<HTMLSpanElement>(null);
		const composedRefs = useComposedRefs(forwardedRef, ref);

		return (
			<span
				data-disabled={disabled ? '' : undefined}
				data-orientation={orientation}
				{...trackProps}
				ref={composedRefs}
			>
				{children}
			</span>
		);
	}
);

/* -------------------------------------------------------------------------------------------------
 * SliderRange
 * -----------------------------------------------------------------------------------------------*/

type SliderRangeProps = React.HTMLAttributes<HTMLSpanElement>;

const SliderRange = forwardRef<HTMLSpanElement, SliderRangeProps>(
	({ children, style, ...rangeProps }, forwardedRef) => {
		const { orientation, disabled, size, startEdge } = useContext(Slider);
		const ref = useRef<HTMLSpanElement>(null);
		const composedRefs = useComposedRefs(forwardedRef, ref);

		return (
			<span
				ref={composedRefs}
				data-orientation={orientation}
				data-disabled={disabled ? '' : undefined}
				style={{
					...style,
					[size]: 'var(--volume-slider-progress)',
					[startEdge]: 0,
				}}
				{...rangeProps}
			>
				{children}
			</span>
		);
	}
);

/* -------------------------------------------------------------------------------------------------
 * SliderThumb
 * -----------------------------------------------------------------------------------------------*/

type SliderThumbProps = React.HTMLAttributes<HTMLSpanElement>;

const SliderThumb = forwardRef<HTMLSpanElement, SliderThumbProps>(
	({ children, ...thumbProps }, forwardedRef) => {
		const { startEdge, min, max, orientation, disabled, dir } =
			useContext(Slider);
		const volume = useLimeplayStore((state) => state.volume);
		const ariaVolume = Number((volume * 100).toFixed(0));
		const ref = useRef<HTMLSpanElement>(null);
		const composedRefs = useComposedRefs(forwardedRef, ref);

		return (
			<span
				style={{
					position: 'absolute',
					transform: 'var(--volume-slider_thumb-transform)',
					[startEdge]: 'var(--volume-slider-progress)',
				}}
			>
				<span
					role="slider"
					aria-label="Volume Slider"
					aria-valuemin={min}
					aria-valuenow={ariaVolume}
					aria-valuemax={max}
					aria-valuetext={`${ariaVolume}% volume`}
					aria-orientation={orientation}
					data-orientation={orientation}
					data-disabled={disabled ? '' : undefined}
					{...thumbProps}
					ref={composedRefs}
				>
					{children}
				</span>
			</span>
		);
	}
);

type SlideHandlerProps = {
	min: number;
	max: number;
	step: number;
	orientation: React.AriaAttributes['aria-orientation'];
	disabled: boolean;
	dir: Direction;
	inverted: boolean;
};

function calculateVolume(event: UIEvent, props: SlideHandlerProps): number {
	const { min, max, step, orientation: o9n, dir, inverted } = props;

	const clientPosition = o9n === 'vertical' ? event.clientY : event.clientX;

	const rect = event.currentTarget.getBoundingClientRect();

	const sliderSize =
		o9n === 'vertical'
			? event.currentTarget.clientHeight
			: event.currentTarget.clientWidth;

	// Get the position of the slider
	const sliderPosition = o9n === 'vertical' ? rect.top : rect.left;

	// Calculate the position of the event relative to the slider
	const relativePosition = clientPosition - sliderPosition;

	// Calculate the percentage of the slider the event is at
	const percentage = relativePosition / sliderSize;

	// Calculate the new volume value based on the percentage
	let volume = percentage * (max - min) + min;

	// Invert the volume if necessary
	if (inverted) volume = max - volume + min;

	volume = clamp(volume, min, max);

	return volume;
}

// const rect = event.currentTarget.getBoundingClientRect();

// if (orientation === 'vertical') {
// 	newVolume = 1 - (event.clientY - rect.top) / rect.height;
// } else if (direction === 'rtl') {
// 	newVolume = 1 - (event.clientX - rect.left) / rect.width;
// } else {
// 	newVolume = (event.clientX - rect.left) / rect.width;
// }

export function VolumeSlider() {
	const { classes } = useStyles();
	const { volume, playback } = useLimeplayStore((state) => ({
		volume: state.volume,
		playback: state.playback,
	}));

	const direction = 'ltr';

	useVolume({
		syncMuteState: true,
		initialVolume: 0.4,
	});

	const configProps: SlideHandlerProps = {
		min: 0,
		max: 1,
		step: 0.05,
		orientation: 'horizontal',
		disabled: false,
		dir: 'ltr',
		inverted: true,
	};

	const volumeChangeHandler = ({ event }: DragState) => {
		let newVolume = null;
		const step = 0.05;
		// const orientation = event.target.getAttribute('data-orientation');
		// const disabled = event.target.getAttribute('data-disabled');

		// if (disabled !== null) return;

		switch (event.type) {
			case 'pointermove':
			case 'pointerdown': {
				newVolume = calculateVolume(event, configProps);
				break;
			}
			case 'keydown':
				switch (event.key) {
					case 'ArrowUp':
					case 'ArrowRight':
						newVolume = playback.volume + step;
						break;
					case 'ArrowDown':
					case 'ArrowLeft':
						newVolume = playback.volume - step;
						break;
					default:
						break;
				}
				break;
			default:
				break;
		}

		if (newVolume !== null) {
			playback.volume = newVolume;
			if (event.defaultPrevented) event.preventDefault();
		}
	};

	const events = useDrag(volumeChangeHandler);

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				gap: '1rem',
			}}
		>
			<SliderRoot
				tabIndex={0}
				volume={volume}
				className={classes.sliderRoot}
				{...events()}
				{...configProps}
			>
				<SliderTrack className={classes.sliderTrack}>
					<SliderRange className={classes.sliderRange} />
				</SliderTrack>
				<SliderThumb className={classes.sliderThumb} />
			</SliderRoot>
			{/* <SliderRoot
				tabIndex={0}
				volume={volume}
				className={classes.sliderRoot}
				orientation="vertical"
				{...events()}
				disabled
			>
				<SliderTrack className={classes.sliderTrack}>
					<SliderRange className={classes.sliderRange} />
				</SliderTrack>
				<SliderThumb className={classes.sliderThumb}>
					<div>20</div>
				</SliderThumb>
			</SliderRoot> */}
		</div>
	);
}
