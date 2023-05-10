import { useLayoutEffect, useState } from 'react';
import { useLimeplayStore } from '../../store';

export function OverlayOutlet({
	children,
	createPlayer,
}: {
	children: React.ReactNode;
	createPlayer?: CreatePlayer;
}) {
	const playback = useLimeplayStore((state) => state.playback);
	const setPlayer = useLimeplayStore((state) => state.setPlayer);
	const [isLoaded, setIsLoaded] = useState(false);
	const withPlayer = typeof createPlayer === 'function';

	useLayoutEffect(() => {
		if (playback) {
			if (createPlayer) {
				const shakaInstance = createPlayer({
					mediaElement: playback,
				});
				setPlayer(shakaInstance);
				setIsLoaded(true);
			}
		} else {
			console.warn(
				'Did you forgot to use <MediaOutlet /> component? You must pass a HTMLMediaElement'
			);
		}

		return () => {
			setPlayer(null);
			setIsLoaded(false);
		};
	}, [createPlayer, playback, setPlayer]);

	if (!isLoaded) return null;

	return <div>{children}</div>;
}
