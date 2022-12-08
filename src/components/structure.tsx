import React from "react";

interface PlayerStore {
    display: {
        controls: boolean;
        player: boolean;
    };
    video: React.MutableRefObject<HTMLVideoElement | null>;
    player: shaka.Player | null;
    seek: shaka.extern.IUISeekBar;

    mouseStillTimer: shaka.util.Timer | null;

    // Guess work, not implmenting until v1
    cast: {
        allowed: boolean;
        proxy: shaka.cast.CastProxy;
        video: HTMLVideoElement | null;
        player: shaka.Player | null;
    };
    // Guess work, not implmenting until v1
    ads: {
        ad: shaka.extern.IAd;
        manager: shaka.ads.AdManager;
    };
}

export default PlayerStore;
