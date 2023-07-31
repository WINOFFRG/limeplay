import { useEffect, useMemo, useRef, useState } from 'react';
import { getPercentage } from '../utils';
import { useLimeplay } from '../components';

export interface UseBufferConfig {
	events?: ShakaPlayerEvents;
	updateInterval?: number;
}

type Buffer = {
	start: number;
	end: number;
	width: number;
	startPosition: number;
};

export function useBufferInfo({ updateInterval = 1000 }: UseBufferConfig = {}) {
	const [bufferInfo, setBufferInfo] = useState<Buffer[]>([]);
	const currentTimerId = useRef<number>(-1);
	const { playbackRef, playerRef } = useLimeplay();
	const player = playerRef.current;
	const playback = playbackRef.current;

	useEffect(() => {
		const updateSeekHandler = () => {
			clearInterval(currentTimerId.current);

			currentTimerId.current = window.setInterval(() => {
				const [buffer] = player.getBufferedInfo().total;

				const seekRange = player.seekRange();
				const seekRangeSize = seekRange.end - seekRange.start;

				if (player.getBufferFullness() && buffer) {
					const clampedBufferStart = Math.max(
						buffer.start,
						seekRange.start
					);

					const clampedBufferEnd = Math.min(
						buffer.end,
						seekRange.end
					);

					const bufferStartDistance =
						clampedBufferStart - seekRange.start;
					const bufferEndDistance =
						clampedBufferEnd - seekRange.start;

					const bufferWidth = getPercentage(
						bufferEndDistance - bufferStartDistance,
						seekRangeSize
					);

					const bufferStartPosition = getPercentage(
						bufferStartDistance,
						seekRangeSize
					);

					setBufferInfo([
						{
							start: bufferStartDistance,
							end: bufferEndDistance,
							width: bufferWidth,
							startPosition: bufferStartPosition,
						},
					]);
				}
			}, updateInterval);
		};

		const events = ['trackschanged', 'manifestparsed'];

		events.forEach((event) => {
			playback.addEventListener(event, updateSeekHandler);
		});

		updateSeekHandler();

		return () => {
			if (playback) {
				events.forEach((event) => {
					playback.removeEventListener(event, updateSeekHandler);
				});
			}

			clearInterval(currentTimerId.current);
		};
	}, [updateInterval]);

	return {
		bufferInfo,
	};
}
