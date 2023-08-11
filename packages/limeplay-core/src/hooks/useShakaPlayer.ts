import { useEffect, useState } from 'react';
import shaka from 'shaka-player';
import { useLimeplay } from '../components/LimeplayProvider';

export function useShakaPlayer() {
	const { playback, setPlayer } = useLimeplay();
	const [error, setError] = useState<shaka.util.Error | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		console.log('[useShakaPlayer] : Mounting');

		let _player: shaka.Player | null = null;

		const errorHandler = (event: shaka.util.Error | Event) => {
			if (event instanceof Event) return;
			setError(event);
		};

		if (playback) {
			_player = new shaka.Player(playback);
			_player.addEventListener('error', errorHandler);
			setPlayer(_player);
			setIsLoaded(true);
		}

		return () => {
			console.log('[useShakaPlayer] : Unmounting');

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
