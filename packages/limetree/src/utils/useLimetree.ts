import { useEffect, useState } from 'react';
import shaka from 'shaka-player';
import useStore from '../store';
import configure from './configure';

export default function useLimetree() {
	const video = useStore((state) => state.video);
	const setPlayerConfig = useStore((state) => state.setPlayerConfig);
	const setShakaPlayer = useStore((state) => state.setShakaPlayer);
	const [isDestroyed, setIsDestroyed] = useState(true);

	useEffect(() => {
		if (!video || !isDestroyed) return;

		const mainPlayer = new shaka.Player(video);
		const configuration = configure(mainPlayer);
		mainPlayer.configure(configuration.shaka);

		window.shaka = mainPlayer;

		setPlayerConfig(configuration);
		setShakaPlayer(mainPlayer);

		(async () => {
			await mainPlayer.load(configuration.playback.url);
			// await video.play();
		})();

		return () => {
			(async () => {
				if (!mainPlayer) return;
				setIsDestroyed(false);

				await mainPlayer.detach();
				await mainPlayer.destroy();

				setShakaPlayer(null);
				setPlayerConfig(null);
				setIsDestroyed(true);
			})();
		};
	}, [video, isDestroyed]);
}
