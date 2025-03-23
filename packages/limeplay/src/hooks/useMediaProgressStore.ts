import { StateCreator } from 'zustand';

export interface MediaProgressStore {
	/** Time range that is buffered in [start, end] seconds.
	 * @note There may be multiple ranges, but we only provide the range the currentTime is in */
	buffered: [number, number];
	setBuffered: (buffered: [number, number]) => void;
	/** Media playback progress, between 0-1. */
	progress: number;
	setProgress: (progress: number) => void;
	/** Current playback time, in seconds. */
	currentTime: number;
	setCurrentTime: (currentTime: number) => void;
	/** Hovered time that would be seeked to on pointerDown */
	nextTime: number;
	setNextTime: (nextTime: number) => void;
}

export const createMediaProgressStore: StateCreator<
	MediaProgressStore,
	[],
	[],
	MediaProgressStore
> = (set) => ({
	progress: 0,
	setProgress: (progress: number) => set({ progress }),
	buffered: [0, 0],
	setBuffered: (buffered: [number, number]) => set({ buffered }),
	currentTime: 0,
	setCurrentTime: (currentTime: number) => set({ currentTime }),
	nextTime: 0,
	setNextTime: (nextTime: number) => set({ nextTime }),
});
