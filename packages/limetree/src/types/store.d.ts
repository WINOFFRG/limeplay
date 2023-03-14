interface SeekRange {
	start: number;
	end: number;
}

interface Store {
	video: HTMLVideoElement | null;
	setVideoElement: (videoElement: HTMLVideoElement | null) => void;
	playerConfig: PlayerConfig | null;
	setPlayerConfig: (playerConfig: PlayerConfig | null) => void;
	shakaPlayer: shaka.Player | null;
	setShakaPlayer: (shakaPlayer: shaka.Player | null) => void;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	playerBaseWrapper: React.RefObject<HTMLDivElement> | null;
	setPlayerBaseWrapper: (
		playerBaseWrapper: React.RefObject<HTMLDivElement> | null
	) => void;

	currentTime: number;
	setCurrentTime: (currentTime: number) => void;
	duration: number;
	setDuration: (duration: number) => void;
	getDuration: () => number;
	isLive: boolean;
	setIsLive: (isLive: boolean) => void;
	getIsLive: () => boolean;
	liveLatency: number;
	setLiveLatency: (liveLatency: number) => void;
	getLiveLatency: () => number;
	progress: number;
	setProgress: (progress: number) => void;
	seekRange: SeekRange;
	setSeekRange: (seekRange: SeekRange) => void;
	getSeekRange: () => SeekRange;
	isSeeking: boolean;
	setIsSeeking: (isSeeking: boolean) => void;
	getIsSeeking: () => boolean;
	bufferRange: SeekRange;
	setBufferRange: (bufferRange: SeekRange) => void;
}
