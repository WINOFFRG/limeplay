import { useLimeplayStore } from '@limeplay/core/src/store';
import { useLoading } from '@limeplay/core/src/hooks';
import useStyles from './styles';

export default function PlayerLoader() {
	const { classes } = useStyles();
	const player = useLimeplayStore((state) => state.player);
	const { isLoading } = useLoading({
		player,
	});

	return isLoading ? <div className={classes.playerLoader} /> : null;
}
