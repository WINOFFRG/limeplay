import useStore from '../../store/index';
import useStyles from './styles';
import useLoading from '../../hooks/useLoading';

export default function PlayerLoader() {
	const { classes } = useStyles();
	const shakaPlayer = useStore((state) => state.shakaPlayer);
	// @ts-ignore
	const { isLoading } = useLoading(shakaPlayer);

	return isLoading ? <div className={classes.playerLoader} /> : null;
}
