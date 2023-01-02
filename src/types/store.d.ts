interface Store {
    video: Video | null;
    setVideoElement: (videoElement: HTMLVideoElement | null) => void;
    playerConfig: PlayerConfig | null;
    setPlayerConfig: (playerConfig: PlayerConfig | null) => void;
    shakaPlayer: shaka.Player | null;
    setShakaPlayer: (shakaPlayer: shaka.Player | null) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}
