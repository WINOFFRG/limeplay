interface TimelineControls {

    pauseWhileSeeking: boolean;

    canSeek: boolean;

    readOnly: boolean;

    withSeekPreview: boolean;

    currentTime: number;

    remainingTime: number;

    duration: number;

    withPlayhead: boolean;

    showPlayheadOnHover: boolean;
}

export default function useTimelineControl(): TimelineControls {

    // @ts-ignore
    return {}
}
