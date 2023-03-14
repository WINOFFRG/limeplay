import { useCallback, useEffect, useState } from 'react';
import { useInterval } from '../utils/use-interval';
import { getPercentage } from '../utils';

interface BufferInfo {
	start: number;
	end: number;
	width: number;
	startPosition: number;
}

export default function useBufferInfo(
	playback: HTMLMediaElement,
	player: shaka.Player
) {
	const UPDATE_INTERVAL = 2000;
	const [bufferInfo, setBufferInfo] = useState<BufferInfo[]>([]);

	const callbackFn = useCallback(() => {
		const buffer = player.getBufferedInfo().total;
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

	return { bufferInfo };
}
