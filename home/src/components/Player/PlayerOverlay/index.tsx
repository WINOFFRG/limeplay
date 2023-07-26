import { useEffect } from 'react';
import mux from 'mux.js';
import { useShakaPlayer } from '@limeplay/core';
import ControlsOverlay from '../ControlsOverlay';
import useStyles from './styles';
import PlayerLoader from '../Loader';

export function PlayerOutlet() {
	const { classes } = useStyles();
	const { playerRef, isLoaded, error } = useShakaPlayer();

	if (error) {
		const onErrorHandler = (event) => {
			if (event.code && event.severity) {
				return `Shaka Player failed with an Error Code: ${event.code} :: Severity: ${event.severity}`;
			}
			return `Shaka Player failed with an Error: ${event.message}`;
		};

		throw new Error(onErrorHandler(error));
	}

	useEffect(() => {
		if (playerRef.current && playerRef.current.getLoadMode() !== 0) {
			if (!window.muxjs) {
				window.muxjs = mux;
			}

			// playerRef.current.configure(
			// 	JSON.parse(process.env.NEXT_PUBLIC_SHAKA_CONFIG) ?? {}
			// );

			const url =
				'https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8' ||
				process.env.NEXT_PUBLIC_LIVEPLAYBACK_URL;

			playerRef.current.load(url); // Error's during load need to be handled separately

			// @ts-ignore
			window.player = playerRef.current;
		}
	}, [isLoaded]);

	if (!isLoaded) return null;

	return (
		<div className={classes.overlayWrapper}>
			<PlayerLoader />
			<ControlsOverlay />
		</div>
	);
}
