import { useLimeplayStore } from '@limeplay/core/src/store';
import { useLayoutEffect } from 'react';
import ControlsOverlay from '../ControlsOverlay';
import useStyles from './styles';
import PlayerLoader from '../Loader';

export default function PlayerOverlay() {
	const { classes } = useStyles();

	const playback = useLimeplayStore((state) => state.playback);
	const player = useLimeplayStore((state) => state.player);

	useLayoutEffect(() => {
		if (!player) return;

		player.configure({
			drm: {
				clearKeys: {
					'31f563ec4d055f04a7077e638b046de4':
						'695248391f00f7395e51f0e13201ed00',
				},
			},
		});

		player.load(
			'https://bpprod6linear.akamaized.net/bpk-tv/irdeto_com_Channel_637/output/manifest.mpd'
		);
	}, [player]);

	if (!playback) return null;

	return (
		<div className={classes.overlayWrapper}>
			<PlayerLoader />
			<ControlsOverlay />
		</div>
	);
}
