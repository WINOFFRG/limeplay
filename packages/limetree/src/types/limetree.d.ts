interface PlayerConfig {
    playback: {
        url: string;
        startTime?: number;
        drm?: {};
        prerolls: string[];
    };
    shaka: shaka.extern.PlayerConfiguration;
}
