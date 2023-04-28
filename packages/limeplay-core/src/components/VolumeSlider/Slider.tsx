import {
	createContext,
	forwardRef,
	useContext,
	useMemo,
	useRef,
	useState,
} from 'react';
import { clamp } from 'lodash';
import { DragState, useGesture } from '@use-gesture/react';
import { useLimeplayStore } from '../../store';
import { useVolume } from '../../hooks';
import useStyles from './styles';
import { useComposedRefs } from '../../hooks/compose-refs';

type Direction = 'ltr' | 'rtl';
type Side = 'top' | 'right' | 'bottom' | 'left';

interface SliderContextValue {
	disabled?: boolean;
	min: number;
	max: number;
	orientation: SliderProps['orientation'];
	startEdge: Side;
	size: 'width' | 'height';
	direction: number;
	value: number;
}

const SLIDER_NAME = 'LimeplayVolumeSlider';

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
}

const SliderRoot = forwardRef<HTMLDivElement, SliderProps>(
	(
		{
			name,
			disabled,
			orientation,
			dir,
			min,
			max,
			step,
			value,
			defaultValue,
			onValueChange,
			children,
			style,
			volume,
			...others
		},
		forwardedRef
	) => {
		const ref = useRef<HTMLDivElement>(null);
		const composedRefs = useComposedRefs(forwardedRef, ref);
		const context: SliderContextValue = useMemo(
			() => ({
				min,
				max,
				disabled,
				orientation,
				value: volume,
				startEdge: orientation === 'vertical' ? 'bottom' : 'left',
				size: orientation === 'vertical' ? 'height' : 'width',
				direction: 1,
			}),
			[min, max, disabled, orientation]
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
						['--volume-slider_thumb-transform' as string]: `${
							orientation === 'vertical'
								? `translateY(50%)`
								: `translateX(-50%)`
						}`,
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
				// {...bindVolumeEvents()}
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
		const { orientation, disabled, size } = useContext(Slider);
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
		const { startEdge, min, max, orientation, disabled } =
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

export function toggleVolume({ lastVolume, playback }) {
	if (playback.muted) {
		playback.muted = false;
		playback.volume = lastVolume;
	} else {
		playback.muted = true;
		playback.volume = 0;
	}
}

export function VolumeSlider() {
	const { classes } = useStyles();

	const { volume, playback } = useLimeplayStore((state) => ({
		volume: state.volume,
		playback: state.playback,
	}));

	const syncMuteState = true;

	useVolume({
		initialVolume: 0.5,
		syncMuteState,
	});

	const volumeChangeHandler = ({ event }: DragState) => {
		let newVolume = null;
		const step = 0.05;
		const orientation = event.target.getAttribute('data-orientation');

		switch (event.type) {
			case 'pointermove':
			case 'pointerdown': {
				const rect = event.currentTarget.getBoundingClientRect();

				if (orientation === 'vertical') {
					newVolume = 1 - (event.clientY - rect.top) / rect.height;
				} else {
					newVolume = (event.clientX - rect.left) / rect.width;
				}

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
			const clammpedValue = clamp(newVolume, 0, 1);
			playback.volume = clammpedValue;
			if (event.defaultPrevented) event.preventDefault();
		}
	};

	const events = useGesture({
		onDrag: volumeChangeHandler,
	});

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
				orientation="horizontal"
				{...events()}
			>
				<SliderTrack className={classes.sliderTrack}>
					<SliderRange className={classes.sliderRange} />
				</SliderTrack>
				<SliderThumb className={classes.sliderThumb} />
			</SliderRoot>
			<SliderRoot
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
				<SliderThumb className={classes.sliderThumb} />
			</SliderRoot>
		</div>
	);
}
