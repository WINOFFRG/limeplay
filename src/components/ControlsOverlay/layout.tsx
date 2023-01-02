import { useEffect, useRef } from 'react';
import useStore from '../../store';
import PlaybackButton from '../PlaybackButton';
import useStyles from './styles';
import shaka from 'shaka-player/dist/shaka-player.ui.debug';
import VolumeButton from '../VolumeButton';
import FullscreenButton from '../FullscreenButton';
import PipButton from '../PipButton';
import ReverseButton from '../ReverseButton';
import ForwardButton from '../ForwardButton';

export function ControlsTopPanel() {
    const { classes } = useStyles();

    return (
        <div className={classes.controlsTopPanel} role={'none'}>
            <div className={classes.topRightSection}>
                <PipButton />
                <FullscreenButton />
            </div>
        </div>
    );
}

export function ControlsMiddlePanel() {
    const { classes } = useStyles();
    const cuesContainer = useRef<HTMLDivElement>(null);
    const video = useStore((state) => state.video);
    const shakaPlayer = useStore((state) => state.shakaPlayer);

    useEffect(() => {
        const textCuesContainer = new shaka.text.UITextDisplayer(
            video,
            cuesContainer.current
        );

        if (shakaPlayer) {
            const textTracks = shakaPlayer.getTextTracks();
            shakaPlayer.selectTextTrack(textTracks[1]);
            shakaPlayer.setTextTrackVisibility(true);
        }

        return () => {
            textCuesContainer.destroy();
        };
    }, [video, shakaPlayer]);

    return (
        <div
            ref={cuesContainer}
            className={classes.controlsMiddlePanel}
            role={'none'}
        ></div>
    );
}

export function ControlsBottomPanel() {
    const { classes } = useStyles();

    return (
        <div className={classes.controlsBottomPanel} role={'none'}>
            <PlaybackButton />
            <ReverseButton />
            <ForwardButton />
            <VolumeButton />
        </div>
    );
}
