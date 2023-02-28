import { useEffect, useState } from 'react';
import shaka from 'shaka-player';

export default function useLoading(player: shaka.Player) {
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const loadingEventHandler = () => {
			setIsLoading(player.isBuffering());
		};

		player.addEventListener('buffering', loadingEventHandler);

		return () => {
			player.removeEventListener('buffering', loadingEventHandler);
		};
	}, [player]);

	return {
		isLoading,
	};
}
