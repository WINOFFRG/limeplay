import { useEffect, useState } from 'react';
import { useLimeplay } from '../components/LimeplayProvider';

export function useLoading() {
	const [isLoading, setIsLoading] = useState(false);
	const { playerRef } = useLimeplay();
	const player = playerRef.current;

	useEffect(() => {
		const loadingEventHandler = () => {
			const isBuffering = player.isBuffering();
			setIsLoading(isBuffering);

			// if (!playback.paused && isBuffering) playback.pause();
			// else if (playback.paused && !isBuffering) playback.play();
		};

		const events = ['buffering', 'loading'];

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
	}, []);

	return {
		isLoading,
	} as const;
}
