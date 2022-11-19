import {
    Player as ShakaPlayer,
    ui as ShakaUI,
    util as ShakaUtils,
} from "shaka-player/dist/shaka-player.ui.debug";

function buildTimeString(displayTime: number, showHour: boolean) {
    const h = Math.floor(displayTime / 3600);
    const m = Math.floor((displayTime / 60) % 60);
    let s: number | string = Math.floor(displayTime % 60);
    if (s < 10) {
        s = "0" + s;
    }
    let text = m + ":" + s;
    if (showHour) {
        if (m < 10) {
            text = "0" + text;
        }
        text = h + ":" + text;
    }
    return text;
}

function getBestTrack(player: ShakaPlayer) {
    let tracks = player.getVariantTracks();

    // If there is a selected variant track, then we filter out any tracks in
    // a different language.  Then we use those remaining tracks to display the
    // available resolutions.
    const selectedTrack = tracks.find((track) => track.active);
    if (selectedTrack) {
        // Filter by current audio language and channel count.
        tracks = tracks.filter(
            (track) =>
                track.language == selectedTrack.language &&
                track.channelsCount == selectedTrack.channelsCount
        );
    }

    // Remove duplicate entries with the same resolution or quality depending
    // on content type.  Pick an arbitrary one.
    tracks = tracks.filter((track, idx) => {
        const otherIdx = tracks.findIndex((t) => t.height == track.height);
        return otherIdx == idx;
    });

    // Sort the tracks by height or bandwidth depending on content type.
    tracks.sort((t1, t2) => {
        if (t1.height && t2.height) {
            return t2.height - t1.height;
        }
    });

    return tracks[0];
}

export const utils = {
    buildTimeString,
    getBestTrack,
};
