import useStore from '../../store';
import PlayerLoader from '../Loader';
import useStyles from './styles';

const PlayerOverlay: React.FC = () => {
    const { classes } = useStyles();

    return (
        <div className={classes.overlayWrapper}>
            <PlayerLoader />
        </div>
    );
};

export default PlayerOverlay;
