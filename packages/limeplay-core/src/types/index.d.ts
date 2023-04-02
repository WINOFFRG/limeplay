export interface MediaTimeStats {
	mediaCurrentTime: number | undefined;
	mediaEndTime: number | undefined;
}

export interface PlayerRefs {
	player: ShakaPlayer;
	ui: typeof ShakaUI.Overlay;
	videoElement: HTMLVideoElement;
}
