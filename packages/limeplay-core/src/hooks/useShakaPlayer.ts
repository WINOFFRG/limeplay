import { useEffect, useState } from 'react';
import shaka from 'shaka-player';
import { useLimeplay } from '../components/LimeplayProvider';

export function useShakaPlayer() {
	const { playback, player, setPlayer } = useLimeplay();
	const [error, setError] = useState<shaka.util.Error | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		console.log('[useShakaPlayer] : Mounting');

		const errorHandler = (event: shaka.util.Error | Event) => {
			if (event instanceof Event) return;
			setError(event);
		};

		if (playback && !isLoaded) {
			const _player = new shaka.Player(playback);
			_player.addEventListener('error', errorHandler);
			setPlayer(_player);
			setIsLoaded(true);
		}

		return () => {
			console.log('[useShakaPlayer] : Unmounting');

			setIsLoaded(false);
			setError(null);

			if (player) {
				// const _player = playerRef.current;
				// _player.removeEventListener('error', errorHandler);
				player.destroy();
				setPlayer(null);
			}
		};
	}, [playback]);

	return {
		error,
		isLoaded,
	};
}
