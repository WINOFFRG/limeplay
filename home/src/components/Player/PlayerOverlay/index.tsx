import {
	useLimeplayStore,
	useLimeplayStoreAPI,
} from '@limeplay/core/src/store';
import { useEffect, useState, useRef } from 'react';
import { useSafeLoad } from '@limeplay/core/src/hooks';
// @ts-ignore
import mux from 'mux.js';
import { useRouter } from 'next/router';
import { merge } from 'lodash';
import ControlsOverlay from '../ControlsOverlay';
import useStyles from './styles';
import PlayerLoader from '../Loader';

export default function PlayerOverlay() {
	// useSafeLoad();
	const { classes } = useStyles();
	const playback = useLimeplayStore((state) => state.playback);
	const player = useLimeplayStore((state) => state.player);
	const isSafeLoad = useLimeplayStore((state) => state.isSafeLoad);
	const { getState } = useLimeplayStoreAPI();
	const router = useRouter();
	const [error, setError] = useState<string>(null);
	const isMounted = useRef(false);

	const demoPlabackUrl =
		'https://embed-cloudfront.wistia.com/deliveries/4a77e940176149046375a5036dbf2f7f01ce3a59.m3u8';

	if (error) {
		throw new Error(error);
	}

	useEffect(() => {
		if (isMounted.current) return;
		isMounted.current = true;

		if (!window.muxjs) {
			window.muxjs = mux;
		}

		const onErrorHandler = (event) => {
			if (event.code && event.severity) {
				setError(`
						Shaka Player failed with an Error Code: ${event.code} :: Severity: ${event.severity}
					`);
			} else {
				setError(`
						Shaka Player failed with an Error: ${event.message}
					`);
			}
		};

		if (player && getState().isSafeLoad && player.getLoadMode() === 1) {
			const playerConfig = merge(
				player.getConfiguration(),
				JSON.parse(process.env.NEXT_PUBLIC_SHAKA_CONFIG ?? '{}')
			);

			player.configure(playerConfig);

			const tParam = router.query.t;
			let startTime = 0;

			if (tParam) {
				startTime = parseInt(tParam as string, 10);
			}

			player
				.load(
					process.env.NEXT_PUBLIC_PLAYBACK_URL || demoPlabackUrl,
					startTime
				)
				// Error's during load need to be handled separately
				.catch(onErrorHandler);

			player.addEventListener('error', onErrorHandler);
		}

		return () => {
			if (player) {
				player.removeEventListener('error', onErrorHandler);
			}
		};
	}, [player, playback, isSafeLoad, router]);

	if (!playback || !player) return null;

	return (
		<div className={classes.overlayWrapper}>
			<PlayerLoader />
			<ControlsOverlay />
		</div>
	);
}
