import { useEffect, useState } from 'react';
import shaka from 'shaka-player';
import { useLimeplay } from '../components/LimeplayProvider';

export function useShakaPlayer() {
	const { playback, setPlayer } = useLimeplay();
	const [error, setError] = useState<shaka.util.Error | Event | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		let _player: shaka.Player | null = null;

		const errorHandler = (event: shaka.util.Error | Event) =>
			setError(event);

		if (playback) {
			console.log('[ useShakaPlayer ] - Creating new player ');
			_player = new shaka.Player(playback);
			_player.addEventListener('error', errorHandler);
			setPlayer(_player);
			setIsLoaded(true);
		}

		return () => {
			setIsLoaded(false);
			setError(null);

			if (_player) {
				_player.removeEventListener('error', errorHandler);
				_player.destroy();
				setPlayer(null);
			}
		};
	}, [playback]);

	return {
		error,
		isLoaded,
	};
}
