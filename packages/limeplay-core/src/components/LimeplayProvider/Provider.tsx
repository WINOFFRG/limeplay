import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LimeplayContext } from '../../store/context';
import {
	LimeplayStore,
	createLimeplayStore,
	useLimeplayStore,
} from '../../store';

export function LimeplayProvider({ children }) {
	const store = createLimeplayStore();

	return (
		<LimeplayContext.Provider value={store}>
			{children}
		</LimeplayContext.Provider>
	);
}

export function OverlayOutlet({
	children,
	playback,
	player,
}: {
	children: React.ReactNode;
	playback: React.RefObject<HTMLMediaElement>;
	player?: shaka.Player;
}) {
	const setPlayback = useLimeplayStore((state) => state.setPlayback);
	const setPlayer = useLimeplayStore((state) => state.setPlayer);
	const [isLoaded, setIsLoaded] = useState(false);

	useLayoutEffect(() => {
		if (playback.current) {
			setPlayback(playback.current);

			if (player) {
				player.attach(playback.current);
				setPlayer(player);
			}

			setIsLoaded(true);
		}

		return () => {
			if (playback.current) {
				setIsLoaded(false);
				console.log('Ending OverlayOutlet');
			}
		};
	}, [isLoaded, playback, player]);

	return <>{isLoaded && children}</>;
}
