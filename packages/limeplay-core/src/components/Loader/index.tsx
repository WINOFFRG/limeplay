import { memo } from 'react';
import useStyles from './styles';
import { useLimeplayStore } from '../../store';

export default function PlayerLoader() {
	const { classes } = useStyles();
	const isLoading = useLimeplayStore((state) => state.isLoading);

	return isLoading ? <div className={classes.playerLoader} /> : null;
}
