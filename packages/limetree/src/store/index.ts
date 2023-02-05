import create from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create<Store>()(
    devtools(
        (set) => ({
            video: null,
            setVideoElement: (videoElement: HTMLVideoElement | null) => {
                set({ video: videoElement });
            },
            playerConfig: null,
            setPlayerConfig: (playerConfig: PlayerConfig | null) => {
                set({ playerConfig: playerConfig });
            },
            shakaPlayer: null,
            setShakaPlayer: (shakaPlayer: shaka.Player | null) => {
                set({ shakaPlayer: shakaPlayer });
            },
            isLoading: false,
            setIsLoading: (isLoading: boolean) => {
                set({ isLoading: isLoading });
            },
            playerBaseWrapper: null,
            setPlayerBaseWrapper: (
                playerBaseWrapper: HTMLDivElement | null
            ) => {
                set({ playerBaseWrapper: playerBaseWrapper });
            },
        }),
        {
            name: 'Limetree',
        }
    )
);

export default useStore;
