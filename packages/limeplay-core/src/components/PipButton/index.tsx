import { useCallback, useEffect, useState } from 'react';
import { useLimeplayStore } from '../../store';

interface PipControlProps {
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

	const { pipEnterIcon, pipExitIcon, children, ...others } = props;

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
		<button
			aria-label={
				isPip ? 'Exit Picture-in-Picture' : 'Enter Picture-in-Picture'
			}
			type="button"
			onClick={togglePip}
			{...others}
		>
			{isPip ? pipExitIcon : pipEnterIcon}
			{children}
		</button>
	);
}

PipButton.defaultProps = defaultProps;
