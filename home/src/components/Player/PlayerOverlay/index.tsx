import {
	useLimeplayStore,
	useLimeplayStoreAPI,
} from '@limeplay/core/src/store';
import { useEffect } from 'react';
import { useSafeLoad } from '@limeplay/core/src/hooks';
import ControlsOverlay from '../ControlsOverlay';
import useStyles from './styles';
import PlayerLoader from '../Loader';

export default function PlayerOverlay() {
	useSafeLoad();
	const { classes } = useStyles();
	const playback = useLimeplayStore((state) => state.playback);
	const player = useLimeplayStore((state) => state.player);
	const isSafeLoad = useLimeplayStore((state) => state.isSafeLoad);
	const { getState } = useLimeplayStoreAPI();
	const demoPlabackUrl =
		'https://storage.googleapis.com/nodejs-streaming.appspot.com/uploads/f6b7c492-e78f-4b26-b95f-81ea8ca21a18/1642708128072/manifest.mpd';

	useEffect(() => {
		try {
			if (player && getState().isSafeLoad && player.getLoadMode() === 1) {
				let playerConfig =
					process.env.NEXT_PUBLIC_SHAKA_CONFIG ||
					player.getConfiguration();

				if (process.env.NEXT_PUBLIC_SHAKA_CONFIG) {
					playerConfig = JSON.parse(
						process.env.NEXT_PUBLIC_SHAKA_CONFIG
					);
				}

				player.configure(playerConfig);
				player.load(
					process.env.NEXT_PUBLIC_PLAYBACK_URL || demoPlabackUrl
				);
			}
		} catch (error) {
			console.log(error);
		}
	}, [player, playback, isSafeLoad]);

	return (
		<div className={classes.overlayWrapper}>
			<PlayerLoader />
			<ControlsOverlay />
		</div>
	);
}
