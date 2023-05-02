interface SeekRange {
	start: number;
	end: number;
}

interface BufferInfo {
	start: number;
	end: number;
	width: number;
	startPosition: number;
}

interface InitialStore {
	playback: HTMLMediaElement | null;
	setPlayback: (playback: HTMLMediaElement) => void;
	player: shaka.Player | null;
	setPlayer: (player: shaka.Player) => void;
}
