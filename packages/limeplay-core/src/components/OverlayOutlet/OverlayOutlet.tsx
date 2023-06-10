import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
	const [player, setStatePlayer] = useState<shaka.Player | null>(null);

	useEffect(() => {
		if (playback) {
			if (createPlayer) {
				const shakaInstance = createPlayer({
					mediaElement: playback,
				});
				setPlayer(shakaInstance);
				setIsLoaded(true);
				setStatePlayer(shakaInstance);
			}
		} else {
			console.warn(
				'Did you forgot to use <MediaOutlet /> component? You must pass a HTMLMediaElement'
			);
		}

		return () => {
			setIsLoaded(false);
			setPlayer(null);
		};
	}, [createPlayer, playback, setPlayer]);

	if (!isLoaded || !playback || !player) return null;

	return <div>{children}</div>;
}
