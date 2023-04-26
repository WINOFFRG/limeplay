import { useCallback, useEffect, useState } from 'react';
import { DefaultProps, useComponentDefaultProps } from '@mantine/styles';
import { useLimeplayStore } from '../../store';
import ControlButton from '../ControlButton';

interface PipControlProps extends DefaultProps {
	onClick?: () => void;
	pipEnterIcon?: React.ReactNode;
	pipExitIcon?: React.ReactNode;
	children?: React.ReactNode;
}

const defaultProps: Partial<PipControlProps> = {
	pipEnterIcon: null,
	pipExitIcon: null,
	children: null,
	onClick: () => {
		console.log('onClick');
	},
};

export default function PipButton(props: PipControlProps) {
	const playback = useLimeplayStore((state) => state.playback);
	const [isSupported, setIsSupported] = useState<boolean>(false);
	const [isPip, setIsPip] = useState<boolean>(false);

	const { pipEnterIcon, pipExitIcon, children, ...others } =
		useComponentDefaultProps('PipControl', defaultProps, props);

	const togglePip = useCallback(async () => {
		if (document.pictureInPictureElement) {
			await document.exitPictureInPicture();
			setIsPip(false);
		} else if (playback && playback instanceof HTMLVideoElement) {
			await playback.requestPictureInPicture();
			setIsPip(true);
		}
	}, [playback]);

	useEffect(() => {
		if (!isSupported) {
			setIsSupported(document.pictureInPictureEnabled);
		}
	}, [playback]);

	if (!isSupported) {
		return null;
	}

	return (
		<ControlButton
			aria-label={
				isPip ? 'Exit Picture-in-Picture' : 'Enter Picture-in-Picture'
			}
			onClick={togglePip}
			{...others}
		>
			{isPip ? pipExitIcon : pipEnterIcon}
			{children}
		</ControlButton>
	);
}

PipButton.defaultProps = defaultProps;
