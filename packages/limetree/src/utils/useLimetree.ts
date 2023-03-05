// @ts-nocheck
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

		// Only for debugging purposes
		window.player = mainPlayer;
		window.shaka = shaka;

		setPlayerConfig(configuration);
		setShakaPlayer(mainPlayer);

		mainPlayer.load(configuration.playback.url);

		// eslint-disable-next-line consistent-return
		return () => {
			if (mainPlayer) {
				setIsDestroyed(false);
				setShakaPlayer(null);
				setPlayerConfig(null);
				setIsDestroyed(true);
			}
		};
	}, [video, isDestroyed]);
}
