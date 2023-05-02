// @ts-nocheck
import { useCallback, useEffect } from 'react';
import { StateCreator } from 'zustand';
import { useInterval } from '../utils/use-interval';
import { getPercentage } from '../utils';
import { useLimeplayStore } from '../store';

export interface UseBufferConfig {
	updateInterval?: number;
}

type Buffer = {
	start: number;
	end: number;
	width: number;
	startPosition: number;
};

export interface BufferSlice {
	bufferInfo: Buffer[];
	setBufferInfo: (bufferInfo: Buffer[]) => void;
}

export function useBufferInfo() {
	const UPDATE_INTERVAL = 2000;

	const player = useLimeplayStore((state) => state.player);
	const setBufferInfo = useLimeplayStore((state) => state.setBufferInfo);

	const callbackFn = useCallback(() => {
		const { total: buffer } = player.getBufferedInfo();
		const seekRange = player.seekRange();
		const duration = seekRange.end - seekRange.start;

		if (buffer) {
			const bufferSegments = buffer.map((item) => {
				const width = getPercentage(item.end - item.start, duration);
				const startPosition = getPercentage(
					item.start - seekRange.start, // Subtract seekRange.start in case of live stream
					duration
				);

				return {
					start: item.start,
					end: item.end,
					width,
					startPosition,
				};
			});

			setBufferInfo(bufferSegments);
		} else {
			setBufferInfo([]);
		}
	}, [player]);

	const { start, stop } = useInterval(callbackFn, UPDATE_INTERVAL);

	useEffect(() => {
		start();

		return () => {
			stop();
		};
	}, []);
}

export const createBufferSlice: StateCreator<BufferSlice> = (set) => ({
	bufferInfo: [],
	setBufferInfo: (bufferInfo: Buffer[]) => set({ bufferInfo }),
});
