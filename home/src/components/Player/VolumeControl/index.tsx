import * as Slider from '@radix-ui/react-slider';
import { useLimeplay, useVolume } from '@limeplay/core';
import { Flex } from '@mantine/core';
import useStyles from './styles';
import { MuteIcon, UnmuteIcon, VolumeHalf } from '../Icons/Icons';
import { IconButton } from '@/components/common/Buttons';

export function VolumeSlider({ volume }: { volume: number }) {
	const { classes } = useStyles();
	const { playbackRef } = useLimeplay();

	return (
		<Slider.Root
			tabIndex={0}
			value={[volume]}
			className={classes.sliderRoot}
			onValueChange={(e) => {
				[playbackRef.current.volume] = e;
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

function VolumeIcon({ volume, muted }: { volume: number; muted: boolean }) {
	if (volume === 0 || muted) return <MuteIcon />;
	if (volume < 0.5) return <VolumeHalf />;
	return <UnmuteIcon />;
}

export default function VolumeControl() {
	const { muted, volume, toggleMute } = useVolume();

	return (
		<Flex gap="xs">
			<IconButton
				aria-pressed={muted}
				aria-label={!muted ? 'Mute' : 'Unmute'}
				onClick={toggleMute}
			>
				<VolumeIcon volume={volume} muted={muted} />
			</IconButton>
			<VolumeSlider volume={volume} />
		</Flex>
	);
}
