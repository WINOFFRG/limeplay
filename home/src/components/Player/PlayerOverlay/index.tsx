import { useEffect, useState } from 'react';
import mux from 'mux.js';
import { useLimeplay, useShakaPlayer } from '@limeplay/core';
import shaka from 'shaka-player';
import ControlsOverlay from '../ControlsOverlay';
import useStyles from './styles';
import PlayerLoader from '../Loader';

export function PlayerOutlet() {
	const { classes } = useStyles();
	const { playerRef, isLoaded, error, playbackRef } = useShakaPlayer();
	const { setPlayback, setPlayer } = useLimeplay();

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
		if (playerRef.current && playerRef.current.getLoadMode() !== 0) {
			if (!window.muxjs) {
				window.muxjs = mux;
			}

			playerRef.current.configure(
				JSON.parse(process.env.NEXT_PUBLIC_SHAKA_CONFIG) ?? {}
			);

			const url =
				// 'http://localhost:3000/manifest2.mpd' ??
				'https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8' ??
				'https://storage.googleapis.com/shaka-demo-assets/tos-surround/dash.mpd' ??
				process.env.NEXT_PUBLIC_LIVEPLAYBACK_URL;

			playerRef.current.load(url); // Error's during load need to be handled separately

			// @ts-ignore
			window.player = playerRef.current;
			setPlayer(playerRef.current);
			setPlayback(playbackRef.current);
		}
	}, [isLoaded, setPlayback, setPlayer]);

	if (!isLoaded) return null;

	return (
		<div className={classes.overlayWrapper}>
			<PlayerLoader />
			<ControlsOverlay />
			<CaptionsContainer />
		</div>
	);
}

function CaptionsContainer() {
	const { classes } = useStyles();
	const [container, setContainer] = useState(null);
	const { player, playback } = useLimeplay();

	useEffect(() => {
		if (playback && container && player) {
			console.log('CONFIGURING!!!');

			const textDisplay = new shaka.text.UITextDisplayer(
				playback,
				container
			);

			player.configure('textDisplayFactory', () => textDisplay);

			player.configure('streaming.alwaysStreamText', true);

			player.setVideoContainer(container);
			console.log(player.getConfiguration(), textDisplay);

			const textFactory = player.getConfiguration().textDisplayFactory();
			textFactory.setTextVisibility(true);
		}
	}, [container, player, playback]);

	return (
		<div
			id="cues-container"
			className={classes.cuesConatiner}
			ref={setContainer}
		/>
	);
}
