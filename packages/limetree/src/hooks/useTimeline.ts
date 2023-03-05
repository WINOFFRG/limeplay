import { useEffect, useRef, useState } from 'react';
import clamp from 'lodash/clamp';
import { useGesture } from '@use-gesture/react';
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
	const precision = 5;
	const UPDATE_INTERVAL = 1000;
	const SEEK_ALLOWED = true;
	const UPDATE_WHILE_SEEKING = false;
	const PAUSE_WHILE_SEEKING = false;

	const [currentTime, setCurrentTime] = useState<number>(
		playback.currentTime
	);
	const [isLive, setIsLive] = useState<boolean>(false);
	const [seekRange, setSeekRange] = useState<SeekRange>({ start: 0, end: 0 });
	const [duration, setDuration] = useState(playback.duration);
	const [liveLatency, setLiveLatency] = useState<number>(-1);
	const [progress, setProgress] = useState<number>(0);
	const [isHour, setIsHour] = useState<boolean>(false);
	const [scrubbedTime, setScrubbedTime] = useState<number>(0);
	const [active, setIsActive] = useState<boolean>(false);

	// console.log('useTimeline: playback');

	const bind = useGesture(
		{
			onDrag: ({ down, offset: [x, y] }) => {
				if (!SEEK_ALLOWED || playback.readyState < 3) return;

				const newPosition = (x * currentTime) / duration;

				console.log('useTimeline: onDrag', newPosition, x);

				const newTimeInSeconds = newPosition * duration;
				const newPlaybackTime =
					newTimeInSeconds + player.seekRange().start;

				if (UPDATE_WHILE_SEEKING) {
					playback.currentTime = newPlaybackTime;
				}

				if (newPosition >= 0 && newPosition <= 100) {
					setProgress(newPosition);
				}

				setScrubbedTime(
					clamp(newPlaybackTime, seekRange.start, seekRange.end)
				);
			},
			onDragStart: () => {
				setIsActive(true);
			},
			onDragEnd: () => {
				setIsActive(false);
			},
		},
		{
			drag: {
				axis: 'x',
			},
		}
	);

	const currentTimerId = useRef<number>(-1);

	// const { ref, active } = useMove(
	// 	({ x: newPosition }) => {
	// 		if (!SEEK_ALLOWED || playback.readyState < 3) return;

	// 		const newTimeInSeconds = newPosition * duration;
	// 		const newPlaybackTime = newTimeInSeconds + player.seekRange().start;

	// 		if (UPDATE_WHILE_SEEKING) {
	// 			playback.currentTime = newPlaybackTime;
	// 		}

	// 		setProgress(newPosition * 100);

	// 		setScrubbedTime(
	// 			clamp(newPlaybackTime, seekRange.start, seekRange.end)
	// 		);
	// 	},
	// 	{
	// 		onScrubStart: () => {
	// 			if (playback.readyState < 3 || !SEEK_ALLOWED) return;

	// 			if (PAUSE_WHILE_SEEKING) {
	// 				playback.pause();
	// 			}
	// 		},
	// 		onScrubEnd: () => {
	// 			if (playback.readyState < 3 || !SEEK_ALLOWED) return;

	// 			if (PAUSE_WHILE_SEEKING) {
	// 				playback.play();
	// 			}

	// 			if (UPDATE_WHILE_SEEKING) return;

	// 			setScrubbedTime((prev) => {
	// 				if (playback) {
	// 					playback.currentTime = prev;
	// 				}
	// 				return prev;
	// 			});
	// 		},
	// 	}
	// );

	useEffect(() => {
		const updateSeekHandler = () => {
			clearInterval(currentTimerId.current);

			setIsLive(player.isLive());
			setDuration(player.seekRange().end - player.seekRange().start);
			setSeekRange(player.seekRange());
			setIsHour(duration > 3600);

			currentTimerId.current = window.setInterval(() => {
				if (isLive) {
					setSeekRange(player.seekRange());

					if (playback.currentTime < player.seekRange().start) {
						// playback.currentTime = player.seekRange().start;
					}

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

					localProgress = localProgress < 0 ? 0 : localProgress;

					localProgress = Number(localProgress.toFixed(precision));

					// if (!active) setProgress(localProgress);
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
	}, [playback, player, isLive]);

	return {
		currentTime,
		duration,
		isLive,
		seekRange,
		liveLatency,
		bind,
		progress,
		// isSeeking: active,
		isHour,
	};
}
