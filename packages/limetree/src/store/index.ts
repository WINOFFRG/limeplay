import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create<Store>()(
	devtools(
		(set, get) => ({
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

			currentTime: 0,
			setCurrentTime: (currentTime: number) => {
				set({ currentTime });
			},
			duration: 0,
			setDuration: (duration: number) => {
				set({ duration });
			},
			getDuration: () => get().duration,
			isLive: false,
			setIsLive: (isLive: boolean) => {
				set({ isLive });
			},
			getIsLive: () => get().isLive,
			liveLatency: -1,
			setLiveLatency: (liveLatency: number) => {
				set({ liveLatency });
			},
			getLiveLatency: () => get().liveLatency,
			progress: 0,
			setProgress: (progress: number) => {
				set({ progress });
			},
			seekRange: { start: 0, end: 0 },
			setSeekRange: (seekRange: SeekRange) => {
				set({ seekRange });
			},
			getSeekRange: () => get().seekRange,
			isSeeking: false,
			setIsSeeking: (isSeeking: boolean) => {
				set({ isSeeking });
			},
			getIsSeeking: () => get().isSeeking,
			bufferRange: { start: 0, end: 0 },
			setBufferRange: (bufferRange: SeekRange) => {
				set({ bufferRange });
			},
		}),
		{
			name: 'Limetree',
		}
	)
);

export default useStore;
