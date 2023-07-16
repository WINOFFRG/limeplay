import { useEffect, useRef, useState } from 'react';
import { useStateRef } from '../utils';
import { useLimeplay } from '../components';

export interface UseLiveConfig {
	updateInterval?: number;
	// TODO: Add initialLive player.goLive() support
	initialLive?: boolean;
}

export function useLive({ updateInterval = 750 }: UseLiveConfig) {
	const { playbackRef, playerRef } = useLimeplay();
	const playback = playbackRef.current;
	const player = playerRef.current;
	const currentTimerId = useRef<number>(-1);
	const [isLive, setIsLive, isLiveRef] = useStateRef(false);
	const [liveLatency, setLiveLatency] = useState(0);

	useEffect(() => {
		const updateHandler = () => {
			clearInterval(currentTimerId.current);
			setIsLive(player.isLive());

			currentTimerId.current = window.setInterval(() => {
				if (playback.readyState === 0) return;

				if (player.isLive()) {
					const currentSeekRange = player.seekRange();
					setLiveLatency(currentSeekRange.end - playback.currentTime);
				} else {
					setLiveLatency(0);
				}

				if (isLiveRef.current !== player.isLive()) {
					setIsLive(player.isLive());
				}
			}, updateInterval);
		};

		const events = ['trackschanged', 'manifestparsed'];

		events.forEach((event) => {
			playback.addEventListener(event, updateHandler);
		});

		updateHandler();

		return () => {
			if (playback) {
				events.forEach((event) => {
					playback.removeEventListener(event, updateHandler);
				});
			}
			clearInterval(currentTimerId.current);
		};
	}, [updateInterval]);

	return {
		isLive,
		liveLatency,
	} as const;
}
