// @ts-nocheck
import { useCallback } from 'react';
import { useGesture } from '@use-gesture/react';
import { clamp } from 'lodash';
import { DefaultProps, useComponentDefaultProps } from '@mantine/styles';
import { useLimeplayStore } from '../../store';
import useStyles from './styles';
import { useVolume } from '../../hooks';
import ControlButton from '../ControlButton';
import { Box } from '../Box';

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

const defaultProps: Partial<VolumeControlProps> = {
	muteIcon: null,
	volumeHalfIcon: null,
	volumeFullIcon: null,
	children: null,
	disabled: false,
	unmuteOnVolumeChange: false,
	step: 0.05,
};

export default function VolumeControl(props: VolumeControlProps) {
	const { classes } = useStyles();

	const playback = useLimeplayStore((state) => state.playback);
	const muted = useLimeplayStore((state) => state.muted);
	const volume = useLimeplayStore((state) => state.volume);
	const lastVolume = useLimeplayStore((state) => state.lastVolume);
	const setLastVolume = useLimeplayStore((state) => state._setLastVolume);
	const isVolumeHookInjected = useLimeplayStore(
		(state) => state.isVolumeHookInjected
	);
	useVolume();

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

	const volumeChangeHandler = ({ event }) => {
		if (event.type === 'mouseup' || event.type === 'pointermove') {
			const rect = event.currentTarget.getBoundingClientRect();
			const newValue = (event.clientX - rect.left) / rect.width;
			const clammpedValue = clamp(newValue, 0, 1);
			playback.volume = clammpedValue;

			if (muted && unmuteOnVolumeChange) playback.muted = false;
		} else if (event.type === 'keydown') {
			const { key } = event;
			if (key === 'ArrowUp' || key === 'ArrowRight') {
				const clammpedValue = clamp(
					playback.volume + step,
					0,
					1
				).toFixed(2);
				playback.volume = Number(clammpedValue);
			} else if (key === 'ArrowDown' || key === 'ArrowLeft') {
				const clammpedValue = clamp(
					playback.volume - step,
					0,
					1
				).toFixed(2);
				playback.volume = Number(clammpedValue);
			}
		}
	};

	const bindVolumeEvents = useGesture({
		onDrag: volumeChangeHandler,
		onMouseUp: ({ event }) => {
			volumeChangeHandler({ event });
			if (playback.volume > 0) setLastVolume(playback.volume);
		},
	});

	const toggleMute = useCallback(() => {
		if (playback.muted) {
			playback.muted = false;
			playback.volume = lastVolume;
		} else {
			playback.muted = true;
			playback.volume = 0;
		}
	}, [lastVolume, playback]);

	if (!isVolumeHookInjected) return null;

	return (
		<Box className={classes.volumeControl}>
			<ControlButton
				onClick={toggleMute}
				aria-label={muted ? 'Unmute' : 'Mute'}
				aria-pressed={muted}
				disabled={disabled}
				{...others}
			>
				{/* eslint-disable-next-line no-nested-ternary */}
				{!children && muted
					? muteIcon
					: volume < 0.5
					? volumeHalfIcon
					: volumeFullIcon}
				{children}
			</ControlButton>
			{!disabled && (
				<div
					className={classes.volumeSlider}
					role="slider"
					aria-valuemin={0}
					aria-valuemax={100}
					tabIndex={0}
					aria-valuenow={Number((volume * 100).toFixed(0))}
					aria-valuetext={`${(volume * 100).toFixed(0)}% volume`}
					aria-label="Volume"
					{...bindVolumeEvents()}
				>
					<div className={classes.volumeSlider__Slider}>
						<div className={classes.volumeSlider__Duration}>
							<div
								className={classes.volumeSlider__Progress}
								style={{
									width: `${volume * 100}%`,
								}}
							/>
							<div
								className={classes.volumeSlider__Head}
								style={{
									left: `${volume * 100}%`,
								}}
							/>
						</div>
					</div>
				</div>
			)}
		</Box>
	);
}

VolumeControl.defaultProps = defaultProps;
