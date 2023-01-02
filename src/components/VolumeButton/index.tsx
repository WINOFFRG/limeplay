import { useCallback, useEffect, useState } from 'react';
import useStore from '../../store';
import useStyles from './styles';

function UnmuteIcon() {
    const { classes } = useStyles();

    return (
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={classes.iconStyle}
        >
            <path
                d="M11.765 2.627L5.176 9.19 5 9.262H1a.75.75 0 00-.75.75v3.977c0 .416.333.75.75.75h4l.176.073 6.589 6.562c.624.622.985.472.985-.42V3.048c0-.888-.361-1.041-.985-.42zm3.564.076a.744.744 0 00.335 1c4.405 2.194 6.586 4.94 6.586 8.298 0 3.357-2.18 6.103-6.586 8.297a.744.744 0 00-.335 1 .752.752 0 001.007.335c4.927-2.454 7.414-5.684 7.414-9.632 0-3.948-2.487-7.178-7.414-9.632a.752.752 0 00-1.007.334zm.028 4.93a.744.744 0 00.257 1.023c1.44.86 2.136 1.949 2.136 3.345 0 1.395-.696 2.484-2.136 3.344a.744.744 0 00-.257 1.024.752.752 0 001.03.256c1.892-1.131 2.863-2.699 2.863-4.624 0-1.926-.971-3.493-2.864-4.624a.752.752 0 00-1.03.256z"
                stroke="#FFF"
                strokeWidth=".5"
                fill="#FFF"
                fillRule="evenodd"
            />
        </svg>
    );
}

function MuteIcon() {
    const { classes } = useStyles();

    return (
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={classes.iconStyle}
        >
            <g fill="#FFF" fillRule="evenodd">
                <path
                    d="M1.626 9.262H1a.75.75 0 00-.75.75v3.977c0 .416.333.75.75.75h4l.176.073 6.584 6.558.092.087c.573.517.898.351.898-.502v-4.641L1.626 9.262zm10.139-6.635L8.46 5.92l4.29 2.72V3.047c0-.888-.361-1.041-.985-.42z"
                    stroke="#FFF"
                    strokeWidth=".5"
                />
                <path
                    d="M17.458 19.029l1.835 1.168a20.86 20.86 0 01-2.846 1.697 1 1 0 11-.894-1.789 20.354 20.354 0 001.905-1.076zm-1.01-16.923C21.422 4.594 24 7.906 24 12a8.82 8.82 0 01-.748 3.604l-1.716-1.091c.31-.798.464-1.635.464-2.513 0-3.24-2.09-5.927-6.447-8.105a1 1 0 01.894-1.79zm.067 5.037C18.47 8.316 19.5 9.964 19.5 12c0 .395-.039.776-.116 1.142l-1.886-1.2-.004-.156c-.067-1.196-.706-2.147-2.008-2.928a1 1 0 011.029-1.715z"
                    fillRule="nonzero"
                    opacity=".5"
                />
                <path
                    d="M.463 5.844l22 14a1 1 0 001.074-1.688l-22-14A1 1 0 00.463 5.844z"
                    fillRule="nonzero"
                />
            </g>
        </svg>
    );
}

export default function VolumeButton() {
    const { classes } = useStyles();
    const video = useStore((state) => state.video);
    const shakaPlayer = useStore((state) => state.shakaPlayer);
    const [isMuted, setIsMuted] = useState(false);

    const toggleMute = () => {
        if (video) {
            video.muted = !video.muted;
            setIsMuted(video.muted);
        }
    };

    useEffect(() => {
        const handleVolumeChange = () => {
            setIsMuted(video.muted);
        };

        if (video) video.addEventListener('volumechange', handleVolumeChange);

        return () => {
            if (video)
                video.removeEventListener('volumechange', handleVolumeChange);
        };
    }, [video, shakaPlayer]);

    return (
        <div className={classes.volumeControl}>
            <button className={classes.controlButton} onClick={toggleMute}>
                {isMuted ? <MuteIcon /> : <UnmuteIcon />}
            </button>
            <div className={classes.volumeSlider}>
                <div
                    className={classes.volumeSlider__Slider}
                    role={'slider'}
                    tabIndex={0}
                >
                    <div className={classes.volumeSlider__Duration} />
                    {/* <div className={classes.volumeSlider__Progress} /> */}
                </div>
            </div>
        </div>
    );
}
