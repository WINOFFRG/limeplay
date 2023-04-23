import { useEffect, useRef, useState } from 'react';
import { LimeplayContext } from '../store/context';
import { LimeplayStore, createLimeplayStore } from '../store';
import VideoWrapper from './VideoWrapper';
import PlayerOverlay from './PlayerOverlay';

export function Player() {
	const mediaElementRef = useRef<HTMLMediaElement>(null);
	const store = useRef<LimeplayStore | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		if (mediaElementRef.current && !store.current && !isLoaded) {
			store.current = createLimeplayStore({
				mediaElementRef,
			});
			setIsLoaded(true);
		}
	}, [isLoaded]);

	return (
		<LimeplayContext.Provider value={store.current}>
			<div
				style={{
					position: 'relative',
					width: 'auto',
					height: '100%',
					padding: 0,
					margin: 0,
				}}
			>
				{isLoaded && <PlayerOverlay />}
				<VideoWrapper ref={mediaElementRef} />
			</div>
		</LimeplayContext.Provider>
	);
}
