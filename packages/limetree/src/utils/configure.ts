export default function configure(player: shaka.Player) {
	const config: PlayerConfig = {
		playback: {
			url:
				// 'https://dash.akamaized.net/dash264/TestCasesUHD/2b/11/MultiRate.mpd',
				import.meta.env.VITE_PLAYBACK_URL,
			// 'https://storage.googleapis.com/shaka-demo-assets/sintel/dash.mpd',
			// 'https://livesim.dashif.org/livesim/testpic_2s/Manifest_thumbs.mpd',
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
	// config.shaka.manifest.availabilityWindowOverride = 120;
	config.shaka.streaming.forceTransmux = true;
	config.shaka.streaming.bufferingGoal = 120;

	return config;
}
