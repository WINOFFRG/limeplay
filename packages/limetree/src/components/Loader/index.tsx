import { memo } from 'react';
import useStyles from './styles';
import useLoading from '../../hooks/useLoading';

function PlayerLoader() {
	const { classes } = useStyles();
	const { isLoading } = useLoading();

	return isLoading ? <div className={classes.playerLoader} /> : null;
}

const MemoPlayerLoader = memo(PlayerLoader);
export default MemoPlayerLoader;
