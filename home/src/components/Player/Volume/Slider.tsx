import * as Slider from '@radix-ui/react-slider';
import { clamp } from 'lodash';
import useStyles from './styles';

export function VolumeSlider({
	playback,
	volume,
}: {
	playback: HTMLMediaElement;
	volume: number;
}) {
	const { classes } = useStyles();

	return (
		<Slider.Root
			value={[volume]}
			className={classes.sliderRoot}
			onValueChange={(e) => {
				[playback.volume] = e;
			}}
			min={0}
			max={1}
			step={0.05}
		>
			<Slider.Track className={classes.sliderTrack}>
				<Slider.Range className={classes.sliderRange} />
			</Slider.Track>
			<Slider.Thumb className={classes.sliderThumb} />
		</Slider.Root>
	);
}
