import { useCallback, useEffect, useState } from 'react';
import useStore from '../../store';
import useStyles from './styles';

function FullscreenExit() {
    const { classes } = useStyles();

    return (
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={classes.iconStyle}
        >
            <g
                stroke="#FFF"
                strokeWidth={2}
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M1 1l6 6m1-5v6H2m21-7l-6 6m-1-5v6h6M1 23l6-6m1 5v-6H2M23 23l-6-6m-1 5v-6h6" />
            </g>
        </svg>
    );
}

function FullscreenEnter() {
    const { classes } = useStyles();

    return (
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={classes.iconStyle}
        >
            <g
                stroke="#FFF"
                strokeWidth={2}
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M8 8L2 2M1 7V1h6m9 7l6-6m1 5V1h-6M8 16l-6 6m-1-5v6h6M16 16l6 6m1-5v6h-6" />
            </g>
        </svg>
    );
}

export default function FullscreenButton() {
    const { classes } = useStyles();
    const video = useStore((state) => state.video);
    const shakaPlayer = useStore((state) => state.shakaPlayer);
    const playerBaseWrapper = useStore((state) => state.playerBaseWrapper);
    const [isSupported, setIsSupported] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    const toggleFullscreen = useCallback(() => {
        if (video && playerBaseWrapper) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
                setIsFullscreen(false);
            } else {
                playerBaseWrapper.requestFullscreen();
                setIsFullscreen(true);
            }
        }
    }, [video]);

    useEffect(() => {
        if (video) {
            if (!isSupported) {
                if (
                    document.fullscreenEnabled ||
                    // @ts-ignore
                    video.webkitSupportsFullscreen
                ) {
                    setIsSupported(true);
                }
            }
        }
    }, [video]);

    if (!isSupported) return null;

    return (
        <button className={classes.controlButton} onClick={toggleFullscreen}>
            {isFullscreen ? <FullscreenExit /> : <FullscreenEnter />}
        </button>
    );
}
