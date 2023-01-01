import { useRef, useEffect } from 'react';
import useStore from '../../store/index';
import useStyles from './styles';
import useLimetree from '../../hooks/useLimetree';
import shallow from 'zustand/shallow';

const VideoWrapper: React.FC = () => {
    const { classes } = useStyles();
    const videoRef = useRef<HTMLVideoElement>(null);
    const setVideoElement = useStore((state) => state.setVideoElement);
    useLimetree();

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) setVideoElement(videoElement);
    }, []);

    return (
        <div className={classes.playerWrapper}>
            <div className={classes.playerNode}>
                <video
                    autoPlay
                    playsInline
                    ref={videoRef}
                    className={classes.videoElement}
                />
            </div>
        </div>
    );
};

export default VideoWrapper;
