import * as Slider from '@radix-ui/react-slider';
import { useTimelineDrag, useVolume } from '@limeplay/core';
import { Flex } from '@mantine/core';
import { useRef } from 'react';
import { useHotkeys } from '@mantine/hooks';
import useStyles from './styles';
import { MuteIcon, UnmuteIcon, VolumeHalf } from '../Icons/Icons';
import { IconButton } from '@/components/common/Buttons';
import { OnSliderHandlerProps } from '../Timeline';

export function VolumeSlider({
	volume,
	updateVolume,
}: {
	volume: number;
	updateVolume: (value: number) => void;
}) {
	const { classes } = useStyles();
	const elementRef = useRef<HTMLDivElement>(null);

	const config: OnSliderHandlerProps = {
		min: 0,
		max: 1,
		step: 0.1,
		skipSize: 0.5,
		orientation: 'horizontal',
		disabled: false,
		dir: 'ltr',
		inverted: false,
	};

	const { isSliding, value } = useTimelineDrag({
		sliderHandlerConfig: config,
		onSlide: updateVolume,
		ref: elementRef,
		initialValue: volume,
	});

	return (
		<Slider.Root
			tabIndex={0}
			value={[isSliding ? value : volume]}
			ref={elementRef}
			className={classes.sliderRoot}
			min={0}
			max={1}
			step={0.1}
		>
			<Slider.Track className={classes.sliderTrack}>
				<Slider.Range className={classes.sliderRange} />
			</Slider.Track>
			<Slider.Thumb className={classes.sliderThumb} />
		</Slider.Root>
	);
}

function VolumeIcon({ volume, muted }: { volume: number; muted: boolean }) {
	if (volume === 0 || muted) return <MuteIcon />;
	if (volume < 0.5) return <VolumeHalf />;
	return <UnmuteIcon />;
}

export default function VolumeControl() {
	const { muted, volume, toggleMute, updateCurrentVolume } = useVolume();

	useHotkeys([
		['m', () => toggleMute()],
		['ArrowUp', () => updateCurrentVolume(volume + 0.1)],
		['ArrowDown', () => updateCurrentVolume(volume - 0.1)],
	]);

	return (
		<Flex gap="xs">
			<IconButton
				aria-pressed={muted}
				aria-label={!muted ? 'Mute' : 'Unmute'}
				onClick={toggleMute}
			>
				<VolumeIcon volume={volume} muted={muted} />
			</IconButton>
			<VolumeSlider volume={volume} updateVolume={updateCurrentVolume} />
		</Flex>
	);
}
