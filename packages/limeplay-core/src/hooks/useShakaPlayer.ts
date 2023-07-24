import { useEffect, useState } from 'react';
import shaka from 'shaka-player';
// import shaka from 'shaka-player/dist/shaka-player.compiled.debug';
import { useLimeplay } from '../components/LimeplayProvider';

let videoInstanceId = 0;

const generateVideoId = () => {
	videoInstanceId += 1;
	return `video_${videoInstanceId}`;
};

export function useShakaPlayer() {
	const { playbackRef, playerRef } = useLimeplay();
	const [error, setError] = useState<shaka.util.Error | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		console.log(
			` >> 1. (${playerRef.current?.time}) useShakaPlayer Mouted`
		);

		const errorHandler = (event: shaka.util.Error | Event) => {
			// TODO: Handle error for event
			console.log(event);
			if (event instanceof Event) return;
			setError(event);
		};

		if (playbackRef.current) {
			const _player = new shaka.Player(playbackRef.current);
			_player.time = generateVideoId();
			playerRef.current = _player;
			console.log(
				` >> 2. (${playerRef.current.time}) Shaka Player Instance`
			);

			// @ts-ignore
			window[playerRef.current.time] = playerRef.current;
			_player.addEventListener('error', errorHandler);
			setIsLoaded(true);
		}

		return () => {
			console.log(
				` << 6. (${playerRef.current?.time}) useShakaPlayer Unmounted`
			);

			setIsLoaded(false);
			setError(null);

			if (playbackRef.current) {
				const _player = playerRef.current;
				console.log(
					` << 7. (${_player.time}) Shaka Player Instance Destroyed `,
					_player.time
				);

				// playerRef.current = null;
				window[_player.time] = null;
				_player.removeEventListener('error', errorHandler);
				_player.destroy();
				playbackRef.current = null;
			}
		};
	}, []);

	return {
		playerRef,
		playbackRef,
		error,
		isLoaded,
	};
}
