export default function configure(player: shaka.Player) {
    const config: PlayerConfig = {
        playback: {
            url:
                import.meta.env.VITE_PLAYBACK_URL ||
                //     'https://dash.akamaized.net/dash264/TestCasesUHD/2b/11/MultiRate.mpd',
                'https://storage.googleapis.com/shaka-demo-assets/sintel/dash.mpd',
            prerolls: [],
        },
        shaka: player.getConfiguration(),
    };

    if (import.meta.env.VITE_CLEAR_KEYS) {
        const keys = import.meta.env.VITE_CLEAR_KEYS;
        const keyID = keys.split(':')[0];
        const key = keys.split(':')[1];
        config.shaka.drm.clearKeys[keyID] = key;
    }

    config.shaka.manifest.dash.ignoreMinBufferTime = true;

    return config;
}
