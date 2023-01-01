import { createStyles } from '@mantine/styles';

import PlayerOverlay from './PlayerOverlay';
import VideoWrapper from './VideoWrapper';

const useStyles = createStyles((theme) => ({
    playerBase: {
        position: 'relative',
        width: 'auto',
        height: '100vh',
        padding: 0,
        margin: 0,
    },
}));

const FullScreenPlayer: React.FC = () => {
    const { classes } = useStyles();

    return (
        <div className={classes.playerBase}>
            <PlayerOverlay />
            <VideoWrapper />
        </div>
    );
};

export default FullScreenPlayer;
