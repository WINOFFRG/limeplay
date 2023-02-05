import { useEffect, useRef } from 'react';
import useStore from '../../store';
import PlaybackButton, { PlayIcon } from '../PlaybackButton';
import useStyles from './styles';
import VolumeButton from '../VolumeButton';
import FullscreenButton from '../FullscreenButton';
import PipButton from '../PipButton';
import ReverseButton from '../ReverseButton';
import ForwardButton from '../ForwardButton';
import SettingsButton from '../SettingsButton';
import PresentationTimeline from '../PresentationTimeline';

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
    // const shakaPlayer = useStore((state) => state.shakaPlayer);

    // useEffect(() => {
    //     if (!cuesContainer.current) return;

    //     const textCuesContainer = new shaka.text.UITextDisplayer(
    //         video,
    //         cuesContainer.current
    //     );

    //     if (shakaPlayer) {
    //         // @ts-ignore
    //         window['player'] = shakaPlayer;
    //         const textTracks = shakaPlayer.getTextTracks();
    //         shakaPlayer.selectTextTrack(textTracks[1]);
    //         shakaPlayer.setTextTrackVisibility(true);

    //         shakaPlayer.configure(
    //             'textDisplayFactory',
    //             () =>
    //                 new shaka.text.UITextDisplayer(video, cuesContainer.current)
    //         );
    //     }

    //     return () => {
    //         if (textCuesContainer) textCuesContainer.destroy();
    //     };
    // }, [video, shakaPlayer]);

    return (
        <div
            ref={cuesContainer}
            className={classes.controlsMiddlePanel}
            role={'none'}
            onClick={() => {
                if (video) {
                    if (video.paused) video.play();
                    else video.pause();
                }
            }}
        >
            <div className={classes.centrePlaybackIcon}>
                <PlayIcon height={48} width={48} />
            </div>
        </div>
    );
}

export function ControlsBottomPanel() {
    const { classes } = useStyles();

    return (
        <div className={classes.controlsBottomPanelWrapper}>
            <PresentationTimeline />
            <div className={classes.controlsBottomPanel} role={'none'}>
                <div>
                    <PlaybackButton />
                    <ReverseButton />
                    <ForwardButton />
                    <VolumeButton />
                </div>
                <div>
                    <SettingsButton />
                </div>
            </div>
        </div>
    );
}
