import { createContext, createRef, useContext, useMemo } from 'react';
import { useStateRef } from '../utils';

interface LimeplayProviderContextType {
	playbackRef: React.MutableRefObject<HTMLMediaElement | null>;
	playerRef: React.MutableRefObject<shaka.Player | null>;
	containerRef: React.MutableRefObject<HTMLDivElement | null>;
	player: shaka.Player | null;
	setPlayer: (player: shaka.Player | null) => void;
	playback: HTMLMediaElement | null;
	setPlayback: (playback: HTMLMediaElement | null) => void;
}

const LimeplayProviderContext =
	createContext<LimeplayProviderContextType | null>(null);

export function useLimeplay() {
	const context = useContext(LimeplayProviderContext);

	if (!context) {
		throw new Error(
			`useLimeplay hook must be used within a LimeplayProvider`
		);
	}

	return context;
}

export function LimeplayProvider({ children }: { children: React.ReactNode }) {
	const [player, setPlayer, playerRef] = useStateRef<shaka.Player | null>(
		null
	);

	const [playback, setPlayback, playbackRef] =
		useStateRef<HTMLMediaElement | null>(null);

	const defaultContext = useMemo(
		() => ({
			playbackRef,
			playerRef,
			containerRef: createRef<null>(),
			player,
			setPlayer,
			playback,
			setPlayback,
		}),
		[playback, player]
	);

	return (
		<LimeplayProviderContext.Provider value={defaultContext}>
			{children}
		</LimeplayProviderContext.Provider>
	);
}
