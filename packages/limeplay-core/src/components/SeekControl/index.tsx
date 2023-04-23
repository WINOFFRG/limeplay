import { DefaultProps, useComponentDefaultProps } from '@mantine/styles';
import { shallow } from 'zustand/shallow';
import ControlButton from '../ControlButton';
import { useLimeplayStore, useLimeplayStoreAPI } from '../../store';

interface SeekControlProps extends DefaultProps {
	seekIcon?: React.ReactNode;
	seekValue?: number;
	type: 'forward' | 'backward';
	children?: React.ReactNode;
	onClick?: () => void;
}

const defaultProps: Partial<SeekControlProps> = {
	seekIcon: null,
	seekValue: 10,
	children: null,
	// TODO: Add Utils default function here
	onClick: () => {},
};

export default function SeekControl(props: SeekControlProps) {
	const { playback } = useLimeplayStore(
		(state) => ({
			playback: state.playback,
			isPlaying: state.isPlaying,
			isLoading: state.isLoading,
			isPlaybackHookInjected: state.isPlaybackHookInjected,
		}),
		shallow
	);

	const seekRange = useLimeplayStore((state) => state.seekRange);

	const { onClick, seekIcon, type, seekValue, children, ...others } =
		useComponentDefaultProps('SeekButton', defaultProps, props);

	const handleSeek = () => {
		if (type === 'forward') {
			if (playback.currentTime + seekValue > seekRange.end) {
				playback.currentTime = seekRange.end;
			} else {
				playback.currentTime += seekValue;
			}
		} else if (playback.currentTime - seekValue < seekRange.start) {
			playback.currentTime = seekRange.start;
		} else {
			playback.currentTime -= seekValue;
		}
	};

	return (
		<ControlButton
			onClick={handleSeek}
			aria-label={`Seek ${type} ${seekValue} seconds`}
			{...others}
		>
			{!children && seekIcon}
			{children}
		</ControlButton>
	);
}

SeekControl.defaultProps = defaultProps;
