import useStore from '../../store';
import ControlsOverlay from '../ControlsOverlay';
import PlayerLoader from '../Loader';
import useStyles from './styles';

const PlayerOverlay: React.FC = () => {
    const { classes } = useStyles();

    return (
        <div className={classes.overlayWrapper}>
            <PlayerLoader />
            <ControlsOverlay />
        </div>
    );
};

export default PlayerOverlay;
