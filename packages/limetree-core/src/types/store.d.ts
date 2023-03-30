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
	playback: HTMLMediaElement;
	player: shaka.Player;
}
