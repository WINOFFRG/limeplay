import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LimeplayContext } from '../../store/context';
import {
	LimeplayStore,
	createLimeplayStore,
	useLimeplayStore,
} from '../../store';

export function LimeplayProvider({ children }: { children: React.ReactNode }) {
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
			console.log('Playback Element is Found');
			setPlayback(playback.current);

			if (player) {
				console.log('Player is Found');
				player.attach(playback.current).then(() => {
					setPlayer(player);
					setIsLoaded(true);
					console.log('Player is Attached and Loaded');
				});
			}

			return () => {
				console.log('Playback is Unloaded');
				setPlayback(null);
				setPlayer(null);
			};
		}
		console.log('Playback is not loaded');
	}, [player, playback, setPlayback, setPlayer]);

	return <>{isLoaded && children}</>;
}
