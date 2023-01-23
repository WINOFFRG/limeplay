import { createStyles } from '@mantine/styles';

import PlayerOverlay from './PlayerOverlay';
import VideoWrapper from './VideoWrapper';
import { useEffect, useRef } from 'react';
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

const FullScreenPlayer: React.FC = () => {
    const { classes } = useStyles();
    const playerBase = useRef<HTMLDivElement>(null);
    const setPlayerBaseWrapper = useStore(
        (state) => state.setPlayerBaseWrapper
    );

    useEffect(() => {
        if (playerBase.current) {
            setPlayerBaseWrapper(playerBase.current);
        }
    }, []);

    return (
        <div className={classes.playerBase} ref={playerBase}>
            <PlayerOverlay />
            <VideoWrapper />
        </div>
    );
};

export default FullScreenPlayer;
