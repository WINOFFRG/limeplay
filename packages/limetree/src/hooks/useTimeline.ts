import { useEffect, useRef, useState } from 'react';
import { useMove } from '../utils/useMove';

interface UseTimelineResult {
	currentTime: number;
	duration: number;
	isLive: boolean;
}

interface SeekRange {
	start: number;
	end: number;
}

export default function useTimeline(
	playback: HTMLMediaElement,
	player: shaka.Player
) {
	const precision = 8;
	const UPDATE_INTERVAL = 1250;
	const SEEK_ALLOWED = true;
	const UPDATE_WHILE_SEEKING = false;

	const [currentTime, setCurrentTime] = useState(0);
	const [isLive, setIsLive] = useState(false);
	const [seekRange, setSeekRange] = useState<SeekRange>({ start: 0, end: 0 });
	const [duration, setDuration] = useState(0);
	const [liveLatency, setLiveLatency] = useState<number>(-1);
	const [progress, setProgress] = useState<number>(0);
	const [isHour, setIsHour] = useState(false);
	const [scrubbedTime, setScrubbedTime] = useState(0);

	const currentTimerId = useRef<number>(-1);

	const { ref, active } = useMove(
		({ x: newPosition }) => {
			if (!SEEK_ALLOWED) return;

			const newTimeInSeconds = newPosition * duration;

			if (UPDATE_WHILE_SEEKING) {
				playback.currentTime =
					newTimeInSeconds + player.seekRange().start;
			}

			setProgress(newPosition * 100);
			setScrubbedTime(newTimeInSeconds + player.seekRange().start);
		},
		{
			// onScrubStart: () => {
			// 	updateVideoTime.current = null;
			// 	if (video) {
			// 		video.pause();
			// 	}
			// },
			onScrubEnd: () => {
				if (UPDATE_WHILE_SEEKING) return;

				setScrubbedTime((prev) => {
					if (playback) {
						playback.currentTime = prev;
					}
					return prev;
				});
			},
		}
	);

	useEffect(() => {
		const updateSeekHandler = () => {
			setIsLive(player.isLive());
			setDuration(player.seekRange().end - player.seekRange().start);
			setSeekRange(player.seekRange());
			setIsHour(duration > 3600);

			clearInterval(currentTimerId.current);

			currentTimerId.current = window.setInterval(() => {
				if (isLive) {
					setSeekRange(player.seekRange());
					setCurrentTime(
						playback.currentTime - player.seekRange().start
					);
					setDuration(
						player.seekRange().end - player.seekRange().start
					);
					setLiveLatency(
						player.seekRange().end - playback.currentTime
					);
					setIsHour(
						player.seekRange().end - player.seekRange().start > 3600
					);

					let localProgress =
						((player.seekRange().end - playback.currentTime) /
							(player.seekRange().end -
								player.seekRange().start)) *
						100;

					localProgress = 100 - localProgress;
					localProgress = Number(localProgress.toFixed(precision));

					if (!active) setProgress(localProgress);
				} else {
					setSeekRange(player.seekRange());
					setDuration(playback.duration);
					setCurrentTime(playback.currentTime);
					if (liveLatency !== -1) setLiveLatency(-1);

					let localProgress =
						(playback.currentTime / playback.duration) * 100;

					localProgress = Number(localProgress.toFixed(precision));

					if (!active) setProgress(localProgress);
				}
			}, UPDATE_INTERVAL);
		};

		player.addEventListener('manifestparsed', updateSeekHandler);
		player.addEventListener('trackschanged', updateSeekHandler);

		updateSeekHandler();

		return () => {
			player.removeEventListener('manifestparsed', updateSeekHandler);
			player.removeEventListener('trackschanged', updateSeekHandler);
			clearInterval(currentTimerId.current);
		};
	}, [playback, player, isLive, active]);

	return {
		currentTime,
		duration,
		isLive,
		seekRange,
		liveLatency,
		ref,
		progress,
		isSeeking: active,
		isHour,
	};
}
