import { useEffect, useState } from 'react';
import mux from 'mux.js';
import { useLimeplay, useShakaPlayer } from '@limeplay/core';
import shaka from 'shaka-player';
import { merge } from 'lodash';
import ControlsOverlay from '../ControlsOverlay';
import useStyles from './styles';
import PlayerLoader from '../Loader';

export function PlayerOutlet() {
	const { classes } = useStyles();
	const { isLoaded, error } = useShakaPlayer();
	const { player } = useLimeplay();

	if (error) {
		const onErrorHandler = (event) => {
			if (event.code && event.severity) {
				return `Shaka Player failed with an Error Code: ${event.code} :: Severity: ${event.severity}`;
			}
			return `Shaka Player failed with an Error: ${event.message}`;
		};

		console.log('[OVERLAY] : Error', onErrorHandler(error));
		// throw new Error(onErrorHandler(error));
	}

	useEffect(() => {
		if (player && player.getLoadMode() !== 0) {
			// @ts-ignore
			if (!window.muxjs) window.muxjs = mux;

			const localConfig = {
				abr: { enabled: true },
				manifest: { dash: { ignoreMinBufferTime: true } },
				streaming: {
					useNativeHlsOnSafari: true,
				},
				drm: {},
			};

			const mergedConfig = merge(
				localConfig,
				JSON.parse(process.env.NEXT_PUBLIC_SHAKA_CONFIG ?? '{}')
			);

			player.configure(mergedConfig);

			const url =
				// 'http://localhost:3000/manifest2.mpd' ??
				'https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8' ??
				// 'https://storage.googleapis.com/shaka-demo-assets/tos-surround/dash.mpd' ??
				process.env.NEXT_PUBLIC_LIVEPLAYBACK_URL;

			player.load(url);

			// @ts-ignore
			window.player = player;
		}

		// TODO: Not sure if isLoaded needs to be added or not
	}, [player, isLoaded]);

	if (!isLoaded) return null;

	return (
		<div className={classes.overlayWrapper}>
			<PlayerLoader />
			<ControlsOverlay />
			{/* <CaptionsContainer /> */}
		</div>
	);
}

function CaptionsContainer() {
	const { classes } = useStyles();
	const [container, setContainer] = useState(null);
	const { player, playback } = useLimeplay();

	useEffect(() => {
		if (playback && container && player) {
			player.addTextTrackAsync(
				'https://www.vidstack.io/media/sprite-fight.vtt',
				'en',
				'subtitles'
			);

			const textDisplay = new shaka.text.UITextDisplayer(
				playback,
				container
			);

			player.configure('textDisplayFactory', () => textDisplay);
			player.configure('streaming.alwaysStreamText', true);
			player.setVideoContainer(container);
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
