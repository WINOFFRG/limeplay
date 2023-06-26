import {
	useLimeplayStore,
	useLimeplayStoreAPI,
} from '@limeplay/core/src/store';
import { useEffect } from 'react';
import { useSafeLoad } from '@limeplay/core/src/hooks';
// @ts-ignore
import mux from 'mux.js';
import { useRouter } from 'next/router';
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

	const demoPlabackUrl =
		'https://embed-cloudfront.wistia.com/deliveries/4a77e940176149046375a5036dbf2f7f01ce3a59.m3u8';

	const removeQueryParam = (name) => {
		const query = { ...router.query };
		delete query[name];
		router.push(
			{
				pathname: router.pathname,
				query,
			},
			undefined,
			{ shallow: true }
		);
	};

	useEffect(() => {
		try {
			if (!window.muxjs) {
				window.muxjs = mux;
			}

			if (player && getState().isSafeLoad && player.getLoadMode() === 1) {
				let playerConfig = player.getConfiguration();

				if (process.env.NEXT_PUBLIC_SHAKA_CONFIG) {
					const localConfig = JSON.parse(
						process.env.NEXT_PUBLIC_SHAKA_CONFIG
					) as shaka.extern.PlayerConfiguration;

					playerConfig = {
						...playerConfig,
						...localConfig,
					};
				}

				player.configure(playerConfig);

				const tParam = router.query.t;
				let startTime = 0;

				if (tParam) {
					startTime = parseInt(tParam as string, 10);
				}

				player.load(
					process.env.NEXT_PUBLIC_PLAYBACK_URL || demoPlabackUrl,
					startTime
				);

				// @ts-ignore
				window.player = player;

				return () => {
					if (player) {
						// player.unload();
						// player.destroy();
					}
				};
			}
		} catch (error) {
			console.log(error);
			throw error;
		}
	}, [player, playback, isSafeLoad, router]);

	if (!playback || !player) return null;

	return (
		<div className={classes.overlayWrapper}>
			<PlayerLoader />
			<ControlsOverlay />
		</div>
	);
}
