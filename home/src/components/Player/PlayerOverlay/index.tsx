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

		// throw new Error(onErrorHandler(error));
	}

	useEffect(() => {
		console.log(` >> 3. (${playerRef.current?.time}) PlayerOutlet Mounted`);

		if (playerRef.current && playerRef.current.getLoadMode() !== 0) {
			if (!window.muxjs) {
				window.muxjs = mux;
			}

			console.log(
				` >> 4. (${
					playerRef.current.time
				}) PlayerOutlet: Content Will be Loaded, Player Mode: ${playerRef.current.getLoadMode()}`
			);

			playerRef.current.configure(
				JSON.parse(process.env.NEXT_PUBLIC_SHAKA_CONFIG) ?? {}
			);

			console.log(playerRef.current.getConfiguration().drm);

			const url = process.env.NEXT_PUBLIC_PLAYBACK_URL;

			playerRef.current.load(url).then(() => {
				console.log(
					` >> 5. PlayerOutlet (${
						playerRef.current.time
					}): Content Loaded, Player Mode: ${playerRef.current.getLoadMode()} :: ${url}`
				);
			});
			// Error's during load need to be handled separately

			console.log('             ');

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
