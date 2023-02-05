interface PlaybackControls {

    /** 
     * Toggles the play state of the track.
     * @returns true if the track is playing, false otherwise.
    */
    togglePlay: () => boolean;    

    /**
     * Plays the track.
     * @returns true if the track is playing, false otherwise.
    */
    isBuffering: boolean ;
}

export default function usePlayback(): PlaybackControls {

    // @ts-ignore
    return {}
}
