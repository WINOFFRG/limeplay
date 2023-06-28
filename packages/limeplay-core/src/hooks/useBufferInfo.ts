import { useEffect, useRef, useState } from 'react';
import { getPercentage } from '../utils';

export interface UseBufferConfig {
	events?: ShakaPlayerEvents;
	playback?: HTMLMediaElement;
	player?: shaka.Player;
	updateInterval?: number;
}

type Buffer = {
	start: number;
	end: number;
	width: number;
	startPosition: number;
};

export function useBufferInfo({
	events,
	playback,
	player,
	updateInterval = 1000,
}: UseBufferConfig = {}) {
	const [bufferInfo, setBufferInfo] = useState<Buffer[]>([]);
	const currentTimerId = useRef<number>(-1);

	useEffect(() => {
		const updateSeekHandler = () => {
			clearInterval(currentTimerId.current);

			currentTimerId.current = window.setInterval(() => {
				const [buffer] = player.getBufferedInfo().total;

				const seekRange = player.seekRange();
				const seekRangeSize = seekRange.end - seekRange.start;

				if (player.getBufferFullness()) {
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

		events = events ?? ['trackschanged', 'manifestparsed'];

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
	}, [playback, player, updateInterval]);

	return {
		bufferInfo,
	};
}
