import { useEffect, useState } from 'react';
import { useLimeplayStore } from '../store';

export default function useLoading() {
	const player = useLimeplayStore((state) => state.player);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const loadingEventHandler = () => {
			setIsLoading(player.isBuffering());
		};

		player.addEventListener('buffering', loadingEventHandler);
		player.addEventListener('loading', loadingEventHandler);

		return () => {
			player.removeEventListener('buffering', loadingEventHandler);
			player.removeEventListener('loading', loadingEventHandler);
		};
	}, [player]);

	return {
		isLoading,
	};
}
