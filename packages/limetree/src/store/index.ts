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
				set({ playerConfig });
			},
			shakaPlayer: null,
			setShakaPlayer: (shakaPlayer: shaka.Player | null) => {
				set({ shakaPlayer });
			},
			isLoading: false,
			setIsLoading: (isLoading: boolean) => {
				set({ isLoading });
			},
			playerBaseWrapper: null,
			setPlayerBaseWrapper: (
				playerBaseWrapper: React.RefObject<HTMLDivElement> | null
			) => {
				set({ playerBaseWrapper });
			},
		}),
		{
			name: 'Limetree',
		}
	)
);

export default useStore;
