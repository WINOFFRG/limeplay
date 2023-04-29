import { clamp } from 'lodash';
import { useDrag } from '@use-gesture/react';
import {
	OnSliderHandlerProps,
	SliderRange,
	SliderRoot,
	SliderThumb,
	SliderTrack,
	onSlideHandler,
	useVolume,
} from '@limeplay/core';
import { useLimeplayStore } from '@limeplay/core/src/store';
import useStyles from './styles';

export function VolumeSlider() {
	const { classes } = useStyles();
	const { volume, playback } = useLimeplayStore((state) => ({
		volume: state.volume,
		playback: state.playback,
	}));

	useVolume({
		syncMuteState: true,
		initialVolume: 0.4,
	});

	const configProps: OnSliderHandlerProps = {
		min: 0,
		max: 1,
		step: 0.05,
		orientation: 'horizontal',
		disabled: false,
		dir: 'ltr',
		inverted: false,
	};

	const volumeChangeHandler = ({
		event,
	}: {
		event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
	}) => {
		let newVolume = null;
		const step = 0.05;

		switch (event.type) {
			case 'pointermove':
			case 'pointerdown': {
				newVolume = onSlideHandler(
					event as React.MouseEvent<HTMLElement>,
					configProps
				);
				break;
			}
			case 'keydown':
				// @ts-ignore
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
			playback.volume = clamp(newVolume, 0, 1);
			if (event.defaultPrevented) event.preventDefault();
		}
	};

	const events: any = useDrag(volumeChangeHandler);

	return (
		<SliderRoot
			tabIndex={0}
			value={volume}
			className={classes.sliderRoot}
			{...events()}
			{...configProps}
		>
			<SliderTrack className={classes.sliderTrack}>
				<SliderRange className={classes.sliderRange} />
			</SliderTrack>
			<SliderThumb className={classes.sliderThumb} />
		</SliderRoot>
	);
}
