import { useGesture, DragState } from '@use-gesture/react';
import { DefaultProps, useComponentDefaultProps } from '@mantine/styles';
import { useLimeplayStore } from '../../store';
import useStyles from './styles';
import { useVolume } from '../../hooks';
import ControlButton from '../ControlButton';

interface VolumeControlProps extends DefaultProps {
	// onClick?: () => void;
	// playIcon?: React.ReactNode;
	// pauseIcon?: React.ReactNode;
	muteIcon?: React.ReactNode;
	volumeHalfIcon?: React.ReactNode;
	volumeFullIcon?: React.ReactNode;
	children?: React.ReactNode;
	disabled?: boolean;
	unmuteOnVolumeChange?: boolean;
	step?: number;
}

/*
	stepSize
	keys
	multiplier

*/

const defaultProps: Partial<VolumeControlProps> = {
	muteIcon: null,
	volumeHalfIcon: null,
	volumeFullIcon: null,
	children: null,
	disabled: false,
	unmuteOnVolumeChange: false,
	step: 0.05,
};

export function VolumeControl(props: VolumeControlProps) {
	const { classes } = useStyles();

	const playback = useLimeplayStore((state) => state.playback);
	const muted = useLimeplayStore((state) => state.muted);
	const volume = useLimeplayStore((state) => state.volume);
	const lastVolume = useLimeplayStore((state) => state.lastVolume);

	const {
		muteIcon,
		volumeHalfIcon,
		volumeFullIcon,
		children,
		disabled,
		step,
		unmuteOnVolumeChange,
		...others
	} = useComponentDefaultProps('VolumeControl', defaultProps, props);

	return (
		// <Box className={classes.volumeControl}>
		<ControlButton
			onClick={() => (playback.muted = !playback.muted)}
			aria-label={muted ? 'Unmute' : 'Mute'}
			aria-pressed={muted}
			disabled={disabled}
			{...others}
		>
			{/* eslint-disable-next-line no-nested-ternary */}
			{muted ? muteIcon : volume < 0.5 ? volumeHalfIcon : volumeFullIcon}
		</ControlButton>
		// </Box>
	);
}

VolumeControl.defaultProps = defaultProps;
