import * as Slider from '@radix-ui/react-slider';
import { clamp } from 'lodash';
import useStyles from './styles';

export function VolumeSlider({ playback }: { playback: HTMLMediaElement }) {
	const { classes } = useStyles();

	return (
		<Slider.Root
			className={classes.sliderRoot}
			onValueChange={(e) => {
				playback.volume = clamp(e[0], 0, 1);
			}}
			defaultValue={[50]}
			min={0}
			max={1}
			step={0.05}
			dir="ltr"
		>
			<Slider.Track className={classes.sliderTrack}>
				<Slider.Range className={classes.sliderRange} />
			</Slider.Track>
			<Slider.Thumb className={classes.sliderThumb} />
		</Slider.Root>
	);
}
