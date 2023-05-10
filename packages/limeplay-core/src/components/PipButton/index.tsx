import { useCallback, useEffect, useState } from 'react';
import { useLimeplayStore } from '../../store';

interface PipControlProps {
	onClick?: () => void;
	pipEnterIcon?: React.ReactNode;
	pipExitIcon?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
}

export default function PipButton(props: PipControlProps) {
	const playback = useLimeplayStore((state) => state.playback);
	const [isSupported, setIsSupported] = useState<boolean>(false);
	const [isPip, setIsPip] = useState<boolean>(false);

	const { pipEnterIcon, pipExitIcon, children, className, ...others } = props;

	const togglePip = () => {
		try {
			if (isPip && document.pictureInPictureElement) {
				document.exitPictureInPicture().then(() => {
					setIsPip(false);
				});
			} else if (playback && playback instanceof HTMLVideoElement) {
				playback.requestPictureInPicture().then(() => {
					setIsPip(true);
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!isSupported) {
			setIsSupported(document.pictureInPictureEnabled);
		}

		return () => {
			setIsSupported(false);

			if (isPip) {
				togglePip();
			}
		};
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
			className={className}
			{...others}
		>
			{isPip ? pipExitIcon : pipEnterIcon}
			{children}
		</button>
	);
}
