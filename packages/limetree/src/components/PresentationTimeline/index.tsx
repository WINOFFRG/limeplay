import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import useStore from '../../store';
import useStyles from './styles';
import { useMove } from '../../hooks/use-move';

function buildTimeString(displayTime: number, showHour: boolean) {
    const h = Math.floor(displayTime / 3600);
    const m = Math.floor((displayTime / 60) % 60);
    let time: number = Math.floor(displayTime % 60);

    let s = time.toString();

    if (time < 10) {
        s = '0' + s;
    }

    let text = m + ':' + s;

    if (showHour) {
        if (m < 10) {
            text = '0' + text;
        }
        text = h + ':' + text;
    }

    return text;
}

function getTargetPosition(
    e: React.MouseEvent<HTMLDivElement>,
    video: HTMLVideoElement,
    slider: MutableRefObject<HTMLDivElement>
) {
    const sliderElement = slider.current;
    const sliderRect = sliderElement.getBoundingClientRect();
    const duration = video.duration;

    if (sliderRect.width <= 0) return null;

    // const eventXPos = e.touches ? e.touches[0].pageX : e.pageX;
    const eventXPos = e.pageX;

    // Means the event is in left region of the slider
    if (eventXPos <= sliderRect.left) {
        return 0;
    }

    // Means the event is in right region of the slider
    if (eventXPos >= sliderRect.right) {
        return duration;
    }

    const hoverPos =
        ((eventXPos - sliderRect.left) / sliderRect.width) * duration;

    return hoverPos;
}

export default function PresentationTimeline() {
    const { classes } = useStyles();
    const video = useStore((state) => state.video);
    const shakaPlayer = useStore((state) => state.shakaPlayer);
    const [displayTime, setDisplayTime] = useState(0);
    const [showHour, setShowHour] = useState(false);
    const progress = useRef<number | null>(null);
    const updateVideoTime = useRef<number | null>(null);
    const [dist, setDist] = useState<null | number>(null);

    const { ref, active } = useMove(
        ({ x }) => {
            if (shakaPlayer && video) {
                const newTime = x;
                const seekRange = shakaPlayer.seekRange();
                const seekRangeSize = seekRange.end - seekRange.start;
                const newTimeInSeconds = newTime * seekRangeSize;

                const newValue = (newTimeInSeconds / video.duration) * 100;
                progress.current = newValue;
                updateVideoTime.current = newTimeInSeconds;
                setDist(x);
            }
        },
        {
            onScrubStart: () => {
                updateVideoTime.current = null;
                if (video) {
                    video.pause();
                }
            },
            onScrubEnd: async () => {
                if (!video || video.readyState === 1) return;
                if (updateVideoTime.current)
                    video.currentTime = updateVideoTime.current;
                await video.play();
            },
        }
    );

    const [hoverTime, setHoverTime] = useState<string | null>(null);
    const hoverPos = useRef<number | null>(null);

    function updateTime() {
        if (shakaPlayer && video && video.readyState > 0 && !video.paused) {
            const seekRange = shakaPlayer.seekRange();
            const seekRangeSize = seekRange.end - seekRange.start;

            if (shakaPlayer.isLive()) {
                const behindLive = Math.floor(
                    seekRange.end - video.currentTime
                );

                const showHour = seekRangeSize >= 3600;
                setShowHour(showHour);

                setDisplayTime(Math.max(0, behindLive));
            } else {
                setDisplayTime(Math.floor(video.currentTime));
                progress.current =
                    (video.currentTime / video.duration) * 100 || 0;
            }
        }
    }

    useEffect(() => {
        const updateTimeline = setInterval(updateTime, 0.125 * 1000);

        return () => {
            clearInterval(updateTimeline);
        };
    }, [video, video?.readyState]);

    if (video && video?.readyState === 0) {
        return null;
    }

    return (
        <div className={classes.timelineWrrapper}>
            <div
                className={classes.timelineSlider__Continer}
                // @ts-ignore
                ref={ref}
                onPointerMove={(e) => {
                    if (active || !video) return;

                    // @ts-ignore
                    const hoverTime = getTargetPosition(e, video, ref);

                    if (!hoverTime) {
                        setHoverTime(null);
                        return;
                    }

                    // convert hoverTime from seconds to ss:mm format
                    const hoverTimeText = buildTimeString(
                        hoverTime,
                        shakaPlayer?.isLive() ? true : false
                    );

                    const hoverPosition = (hoverTime / video.duration) * 100;
                    hoverPos.current = hoverPosition;

                    setHoverTime(hoverTimeText);
                }}
                onPointerLeave={() => {
                    setHoverTime(null);
                }}
            >
                <div className={classes.timelineSlider__ProgressBar}>
                    <div className={classes.timelineSlider__DurationBar}></div>
                    <div
                        className={classes.timelineSlider__DurationPlayed}
                        style={{
                            width: `${
                                // shakaPlayer?.isLive()
                                //     ? 100 - progress
                                //     :
                                progress.current
                            }%`,
                        }}
                    ></div>
                </div>
                <div
                    className={classes.timelineSlider__PlayHead}
                    style={{
                        left: `${
                            // shakaPlayer?.isLive() ? 100 - progress :
                            progress.current
                        }%`,
                    }}
                    tabIndex={1}
                />
                <div
                    style={{
                        display: hoverTime ? 'block' : 'none',
                        left: `${hoverPos.current}%`,
                    }}
                    className={classes.timelineSlider__VerticalBar__Hover}
                ></div>
                <div
                    style={{
                        display: hoverTime ? 'block' : 'none',
                        left: `${hoverPos.current}%`,
                    }}
                    className={
                        classes.timelineSlider__VerticalBarDuration__Hover
                    }
                >
                    {hoverTime}
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                }}
            >
                <span>{shakaPlayer?.isLive() ? '-' : ''}</span>
                <span>{buildTimeString(displayTime, showHour)}</span>
            </div>
            <button
                className={classes.controlButton}
                style={{
                    display: shakaPlayer?.isLive() ? 'flex' : 'none',
                    backgroundColor: shakaPlayer?.isLive() ? 'red' : 'gray',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    border: 'none',
                    fontSize: '12px',
                    height: 'max-content',
                    fontWeight: '700',
                    outline: 'none',
                    cursor: 'pointer',
                    width: 'max-content',
                    whiteSpace: 'nowrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onClick={() => {
                    shakaPlayer?.goToLive();
                }}
            >
                <div>{displayTime >= 3 ? 'GO TO LIVE' : 'LIVE'}</div>
            </button>
        </div>
    );
}
