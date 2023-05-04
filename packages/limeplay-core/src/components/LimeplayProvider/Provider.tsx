import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LimeplayContext } from '../../store/context';
import {
	LimeplayStore,
	createLimeplayStore,
	useLimeplayStore,
} from '../../store';
import { CreatePlayer } from '../../types/limeplay';
import { useComposedRefs } from '../../utils/composeRefs';

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

	if (!playback || (withPlayer && !isLoaded)) return null;

	return <div>{children}</div>;
}

export const MediaOutlet = React.forwardRef(
	({ children }: { children: React.ReactNode }, forwardedRef) => {
		const setPlayback = useLimeplayStore((state) => state.setPlayback);
		const playbackRef = useRef<HTMLMediaElement>(null);
		const composedRefs = useComposedRefs(forwardedRef, playbackRef);

		useEffect(() => {
			if (React.Children.count(children) !== 1) {
				throw new Error(
					'MediaOutlet must have a single child as HTMLMediaElement'
				);
			}

			if (playbackRef.current) {
				setPlayback(playbackRef.current);
			}

			return () => {
				setPlayback(null);
			};
		}, [children, setPlayback]);

		return (
			<>
				{React.cloneElement(children as React.ReactElement, {
					ref: composedRefs,
				})}
			</>
		);
	}
);
