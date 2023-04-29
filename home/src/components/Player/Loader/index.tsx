import { useLimeplayStore } from '@limeplay/core/src/store';
import useStyles from './styles';

export default function PlayerLoader() {
	const { classes } = useStyles();
	const isLoading = useLimeplayStore((state) => state.isLoading);

	return isLoading ? <div className={classes.playerLoader} /> : null;
}
