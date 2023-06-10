import { useEffect, useState } from 'react';

export interface UseLoadingConfig {
	/**
	 * ShakaPlayer events to listen to
	 * @default Events - ['buffering', 'loading']
	 */
	events?: ShakaPlayerEvents;

	player?: shaka.Player;
}

export function useLoading({
	events = ['buffering', 'loading'],
	player,
}: UseLoadingConfig = {}) {
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const loadingEventHandler = () => {
			const isBuffering = player.isBuffering();
			setIsLoading(isBuffering);

			// if (!playback.paused && isBuffering) playback.pause();
			// else if (playback.paused && !isBuffering) playback.play();
		};

		events.forEach((event) => {
			player.addEventListener(event, loadingEventHandler);
		});

		return () => {
			if (player) {
				events.forEach((event) => {
					player.removeEventListener(event, loadingEventHandler);
				});
			}
		};
	}, [player, events]);

	return {
		isLoading,
	};
}
