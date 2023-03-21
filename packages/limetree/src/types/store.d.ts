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

interface Store {
	playback: HTMLMediaElement;
	player: shaka.Player;
	isPlaying: boolean;
	setIsPlaying: (isPlaying: boolean) => void;
	togglePlayback: () => void | null;
}
