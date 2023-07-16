import { createContext, createRef, useContext, useMemo } from 'react';

interface LimeplayProviderContextType {
	playbackRef: React.MutableRefObject<HTMLVideoElement | null>;
	playerRef: React.MutableRefObject<shaka.Player | null>;
	containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

const LimeplayProviderContext =
	createContext<LimeplayProviderContextType | null>({
		playbackRef: createRef<null>(),
		playerRef: createRef<null>(),
		containerRef: createRef<null>(),
	});

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
	const defaultContext = useMemo(
		() => ({
			playbackRef: createRef<null>(),
			playerRef: createRef<null>(),
			containerRef: createRef<null>(),
		}),
		[]
	);

	return (
		<LimeplayProviderContext.Provider value={defaultContext}>
			{children}
		</LimeplayProviderContext.Provider>
	);
}
