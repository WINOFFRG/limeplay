import { useEffect, useRef, useState } from 'react';
import clamp from 'lodash/clamp';
import { StateCreator } from 'zustand';
import { useLimeplayStore, useLimeplayStoreAPI } from '../store';

export interface UseTimelineConfig {
	/**
	 * HTMLMediaElement events to listen to
	 * @default Events - ['volumechange']
	 */
	events?: ShakaPlayerEvents;
}

export interface TimelineSlice {
	isTimelineHookInjected: boolean;
	_setIsTimelineHookInjected: (isVolumeHookInjected: boolean) => void;
	currentTime: number;
	_setCurrentTime: (currentTime: number) => void;
	duration: number;
	_setDuration: (duration: number) => void;
	isLive: boolean;
	_setIsLive: (isLive: boolean) => void;
	_getIsLive: () => boolean;
	currentProgress: number;
	_setCurrentProgress: (currentProgress: number) => void;
	seekRange: SeekRange;
	_setSeekRange: (seekRange: SeekRange) => void;
	liveLatency: number;
	_setLiveLatency: (liveLatency: number) => void;
	isSeeking: boolean;
	_setIsSeeking: (isSeeking: boolean) => void;
	_getIsSeeking: () => boolean;
}

export function useTimeline({ events }: UseTimelineConfig = {}) {
	const precision = 3;
	const UPDATE_INTERVAL = 500;
	const SEEK_ALLOWED = true;
	const UPDATE_WHILE_SEEKING = false;
	const PAUSE_WHILE_SEEKING = false;

	const playback = useLimeplayStore((state) => state.playback);
	const player = useLimeplayStore((state) => state.player);
	const storeSeekRange = useLimeplayStore((state) => state.seekRange);
	const getIsSeeking = useLimeplayStore((state) => state._getIsSeeking);
	const setSeekRange = useLimeplayStore((state) => state._setSeekRange);
	const setCurrentTime = useLimeplayStore((state) => state._setCurrentTime);
	const setDuration = useLimeplayStore((state) => state._setDuration);
	const setIsLive = useLimeplayStore((state) => state._setIsLive);
	const setCurrentProgress = useLimeplayStore(
		(state) => state._setCurrentProgress
	);
	const setLiveLatency = useLimeplayStore((state) => state._setLiveLatency);
	const getIsLive = useLimeplayStore((state) => state._getIsLive);

	const store = useLimeplayStoreAPI();

	const currentTimerId = useRef<number>(-1);

	useEffect(() => {
		const updateSeekHandler = () => {
			clearInterval(currentTimerId.current);
			setIsLive(player.isLive());

			currentTimerId.current = window.setInterval(() => {
				if (playback.readyState === 0) return;

				const seekRange = player.seekRange();

				if (player.isLive()) {
					setSeekRange(seekRange);

					setCurrentTime(
						Number(
							(playback.currentTime - seekRange.start).toFixed(
								precision
							)
						)
					);

					const duration = seekRange.end - seekRange.start;

					if (store.getState().duration !== duration)
						setDuration(duration);

					setLiveLatency(
						Number(
							(seekRange.end - playback.currentTime).toFixed(
								precision
							)
						)
					);

					let localProgress =
						100 -
						((seekRange.end - playback.currentTime) / duration) *
							100;

					localProgress = clamp(localProgress, 0, 100);

					// localProgress = Number(localProgress.toFixed(precision));

					if (!getIsSeeking()) setCurrentProgress(localProgress);

					if (getIsLive() !== player.isLive()) {
						setIsLive(player.isLive());
					}
				} else {
					if (store.getState().duration !== playback.duration)
						setDuration(playback.duration);

					if (storeSeekRange.start === 0 && storeSeekRange.end === 0)
						setSeekRange(player.seekRange());

					setCurrentTime(playback.currentTime);

					const localProgress =
						(playback.currentTime / playback.duration) * 100;

					// localProgress = Number(localProgress.toFixed(precision));

					if (!store.getState().isSeeking)
						setCurrentProgress(localProgress);
				}
			}, UPDATE_INTERVAL);
		};

		const hookEvents: ShakaPlayerEvents = events || [
			'trackschanged',
			'manifestparsed',
		];

		hookEvents.forEach((event) => {
			playback.addEventListener(event, updateSeekHandler);
		});

		updateSeekHandler();

		return () => {
			if (playback) {
				hookEvents.forEach((event) => {
					playback.removeEventListener(event, updateSeekHandler);
				});
			}
			clearInterval(currentTimerId.current);
		};
	}, [playback, player]);
}

const hookName = '@limeplay/hooks/useTimeline';
useTimeline.displayName = hookName;

export const createTimelineSlice: StateCreator<TimelineSlice> = (set, get) => ({
	isTimelineHookInjected: false,
	_setIsTimelineHookInjected: (isTimelineHookInjected: boolean) =>
		set({ isTimelineHookInjected }),
	currentTime: 0,
	_setCurrentTime: (currentTime: number) => set({ currentTime }),
	duration: 0,
	_setDuration: (duration: number) => set({ duration }),
	isLive: false,
	_setIsLive: (isLive: boolean) => set({ isLive }),
	_getIsLive: () => get().isLive,
	currentProgress: 0,
	_setCurrentProgress: (currentProgress: number) => set({ currentProgress }),
	seekRange: { start: 0, end: 0 },
	_setSeekRange: (seekRange: SeekRange) => set({ seekRange }),
	liveLatency: -1,
	_setLiveLatency: (liveLatency: number) => set({ liveLatency }),
	isSeeking: false,
	_setIsSeeking: (isSeeking: boolean) => set({ isSeeking }),
	_getIsSeeking: () => get().isSeeking,
});
