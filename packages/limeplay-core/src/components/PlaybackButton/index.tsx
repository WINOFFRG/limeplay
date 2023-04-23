import { useCallback, useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { DefaultProps, useComponentDefaultProps } from '@mantine/styles';
import { useLimeplayStore } from '../../store';
import { usePlayback } from '../../hooks';
import ControlButton from '../ControlButton';

interface PlaybackButtonProps extends DefaultProps {
	onClick?: () => void;
	playIcon?: React.ReactNode;
	pauseIcon?: React.ReactNode;
	children?: React.ReactNode;
}

const defaultProps: Partial<PlaybackButtonProps> = {
	playIcon: null,
	pauseIcon: null,
	children: null,
	// TODO: Add Utils default function here
	onClick: () => {},
};

export default function PlaybackButton(props: PlaybackButtonProps) {
	usePlayback(); // <--- Singleton hook has been injected here
	const { isLoading, playback, isPlaying, isPlaybackHookInjected } =
		useLimeplayStore(
			(state) => ({
				playback: state.playback,
				isPlaying: state.isPlaying,
				isLoading: state.isLoading,
				isPlaybackHookInjected: state.isPlaybackHookInjected,
			}),
			shallow
		);

	const { onClick, playIcon, pauseIcon, children, ...others } =
		useComponentDefaultProps('PlaybackButton', defaultProps, props);

	useEffect(() => {
		const spacePlayback = (e) => {
			if (e.code === 'Space' && playback) {
				togglePlayback();
				return e.preventDefault();
			}
		};

		document.addEventListener('keydown', spacePlayback);

		return () => {
			document.removeEventListener('keydown', spacePlayback);
		};
	}, [playback]);

	// TODO: Move this function to utils
	const togglePlayback = () => {
		if (isLoading) return;
		if (playback.paused) playback.play();
		else playback.pause();
	};

	if (!isPlaybackHookInjected) return null;

	return (
		<ControlButton
			onClick={togglePlayback}
			aria-label={isPlaying ? 'Pause' : 'Play'}
			{...others}
		>
			{!children && !isPlaying ? playIcon : pauseIcon}
			{children}
		</ControlButton>
	);
}

PlaybackButton.defaultProps = defaultProps;
