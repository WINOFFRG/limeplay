import { useCallback, useEffect, useState } from 'react';
import useStore from '../../store';
import useStyles from './styles';

function PlayIcon() {
    const { classes } = useStyles();

    return (
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={classes.iconStyle}
        >
            <path
                d="M4.245 2.563a.5.5 0 00-.745.435v18.004a.5.5 0 00.745.435l15.997-9.001a.5.5 0 000-.872L4.245 2.563z"
                fill="#FFF"
                stroke="#FFF"
                fillRule="evenodd"
            />
        </svg>
    );
}

function PauseIcon() {
    const { classes } = useStyles();

    return (
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={classes.iconStyle}
        >
            <path
                d="M18 2.5A1.5 1.5 0 0016.5 4v16a1.5 1.5 0 003 0V4A1.5 1.5 0 0018 2.5zm-12 0A1.5 1.5 0 004.5 4v16a1.5 1.5 0 003 0V4A1.5 1.5 0 006 2.5z"
                fill="#FFF"
                stroke="#FFF"
                fillRule="evenodd"
            />
        </svg>
    );
}

export default function PlaybackButton() {
    const { classes } = useStyles();
    const video = useStore((state) => state.video);
    const shakaPlayer = useStore((state) => state.shakaPlayer);
    const isLoading = useStore((state) => state.isLoading);
    const [isPaused, setIsPaused] = useState<boolean>(true);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const handlePlayback = async () => {
        if (video) {
            isPaused ? await video.play() : video.pause();
            setIsPaused(video.paused);
        }
    };

    useEffect(() => {
        if (video) {
            setIsPaused(video.paused);
            setIsDisabled(false);

            video.addEventListener('play', () => setIsPaused(false));
            video.addEventListener('pause', () => setIsPaused(true));
        } else {
            setIsDisabled(true);
        }

        return () => {
            if (video) {
                video.removeEventListener('play', () => setIsPaused(false));
                video.removeEventListener('pause', () => setIsPaused(true));
            }
        };
    }, [video, shakaPlayer]);

    return (
        <button
            disabled={isDisabled ? true : isLoading}
            className={classes.controlButton}
            onClick={handlePlayback}
        >
            {isPaused ? <PlayIcon /> : <PauseIcon />}
        </button>
    );
}
