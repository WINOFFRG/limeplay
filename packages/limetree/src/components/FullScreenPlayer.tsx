import { createStyles } from '@mantine/styles';

import { useEffect, useRef } from 'react';
import PlayerOverlay from './PlayerOverlay';
import VideoWrapper from './VideoWrapper';
import useStore from '../store';

const useStyles = createStyles((theme) => ({
	playerBase: {
		position: 'relative',
		width: 'auto',
		height: '100vh',
		padding: 0,
		margin: 0,
	},
}));

function FullScreenPlayer() {
	const { classes } = useStyles();
	const playerBase = useRef<HTMLDivElement>(null);
	const setPlayerBaseWrapper = useStore(
		(state) => state.setPlayerBaseWrapper
	);

	useEffect(() => {
		if (playerBase.current) {
			setPlayerBaseWrapper(playerBase);
		}
	}, []);

	return (
		<div className={classes.playerBase} ref={playerBase}>
			<PlayerOverlay />
			<VideoWrapper />
		</div>
	);
}

export default FullScreenPlayer;
