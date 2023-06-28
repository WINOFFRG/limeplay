import { useEffect, useRef, useState } from 'react';
import { useStateRef } from '../utils';

export interface UseLiveConfig {
	playback?: HTMLMediaElement;
	player?: shaka.Player;
	updateInterval?: number;
	events?: ShakaPlayerEvents;
	initialLive?: boolean;
}

export function useLive({
	playback,
	player,
	updateInterval = 750,
	events,
	initialLive = true,
}: UseLiveConfig) {
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

		events = events ?? ['trackschanged', 'manifestparsed'];

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
	}, [playback, player, updateInterval, events]);

	return {
		isLive,
		liveLatency,
	};
}
