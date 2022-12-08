import create from "zustand";
import { devtools } from "zustand/middleware";
import { Player as ShakaPlayer } from "shaka-player/dist/shaka-player.ui.debug";

const usePlayerStore = create(
    devtools((set) => ({
        bears: 0,
        increasePopulation: () =>
            set((state: any) => ({ bears: state.bears + 1 })),
        timers: {},
        addTimer: (id: string, timer: shaka.util.Timer) => {
            set((state: any) => ({ timers: { ...state.timers, [id]: timer } }));
        },
        isBuffering: false,
        setIsBuffering: (isBuffering: boolean) =>
            set((state: any) => ({ isBuffering })),
        video: null,
        setVideo: (video: HTMLVideoElement) => set((state: any) => ({ video })),
        liveVideoDelay: 0,
        setLiveVideoDelay: (delay: number) =>
            set((state: any) => ({ liveVideoDelay: delay })),
        playerTimer: null,
        setPlayerTimer: (timer: shaka.util.Timer) =>
            set((state: any) => ({ playerTimer: timer })),
        playing: false,
        setPlaying: (playing: boolean) => set((state: any) => ({ playing })),
        player: null,
        setPlayer: (player: ShakaPlayer) => set((state: any) => ({ player })),
    }))
);

export default usePlayerStore;
