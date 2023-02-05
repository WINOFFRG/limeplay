import { useCallback, useEffect, useState } from 'react';
import useStore from '../../store';
import useStyles from './styles';

function PipExit() {
    const { classes } = useStyles();

    return (
        <svg
            viewBox="0 0 24 18"
            xmlns="http://www.w3.org/2000/svg"
            className={classes.iconStyle}
        >
            <g transform="translate(0 -3)" fill="none" fillRule="evenodd">
                <path d="M4 4v14h19V4H4z" stroke="#FFF" strokeWidth={2} />
                <path
                    d="M19.167 7l.027.002a.748.748 0 01.804.8l.002.031v3.334a.833.833 0 11-1.667 0v-1.44L15.28 12.78a.75.75 0 01-1.06-1.06l3.052-3.054h-1.439a.833.833 0 010-1.666h3.334z"
                    fill="#FFF"
                    fillRule="nonzero"
                />
                <rect
                    fill="#FFF"
                    transform="matrix(-1 0 0 1 11 0)"
                    y={13}
                    width={11}
                    height={8}
                    rx={1}
                />
            </g>
        </svg>
    );
}

function PipEnter() {
    const { classes } = useStyles();

    return (
        <svg
            viewBox="0 0 28 28"
            xmlns="http://www.w3.org/2000/svg"
            className={classes.iconStyle}
        >
            <g transform="matrix(-1 0 0 1 28 2)" fill="none" fillRule="evenodd">
                <path
                    d="M5 5l5 5m1-4v5H6"
                    stroke="#FFF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                />
                <rect
                    stroke="#FFF"
                    strokeWidth={2}
                    transform="matrix(-1 0 0 1 24 0)"
                    x={1}
                    y={1}
                    width={22}
                    height={17}
                    rx={1}
                />
                <rect
                    fill="#FFF"
                    transform="matrix(-1 0 0 1 41 0)"
                    x={13}
                    y={13}
                    width={15}
                    height={11}
                    rx={1}
                />
            </g>
        </svg>
    );
}

export default function PipButton() {
    const { classes } = useStyles();
    const video = useStore((state) => state.video);
    const [isSupported, setIsSupported] = useState<boolean>(false);
    const [isPip, setIsPip] = useState<boolean>(false);

    const togglePip = useCallback(async () => {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
            setIsPip(false);
        } else if (video) {
            await video.requestPictureInPicture();
            setIsPip(true);
        }
    }, [video]);

    useEffect(() => {
        if (!isSupported) {
            setIsSupported(document.pictureInPictureEnabled);
        } else {
            if (document.pictureInPictureElement) {
                setIsPip(true);
            } else {
                setIsPip(false);
            }
        }
    }, [video]);

    return (
        <button className={classes.controlButton} onClick={togglePip}>
            {isPip ? <PipExit /> : <PipEnter />}
        </button>
    );
}
