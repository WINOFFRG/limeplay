import {
    Player as ShakaPlayer,
    ui as ShakaUI,
    extern as ShakaExtern,
} from 'shaka-player';

export interface MediaTimeStats {
    mediaCurrentTime: number | undefined;
    mediaEndTime: number | undefined;
}

export interface PlayerRefs {
    player: ShakaPlayer;
    ui: typeof ShakaUI.Overlay;
    videoElement: HTMLVideoElement;
}
