import { useEffect, useRef, useState } from 'react';
import clamp from 'lodash/clamp';
import { useStateRef } from '../utils';

export interface UseTimelineConfig {
	/**
	 * HTMLMediaElement events to listen to
	 * @default Events - ['trackschanged', 'manifestparsed']
	 */
	events?: ShakaPlayerEvents;
	playback?: HTMLMediaElement;
	player?: shaka.Player;
	updateInterval?: number;
}

const SEEK_ALLOWED = true;
const UPDATE_WHILE_SEEKING = false;
const PAUSE_WHILE_SEEKING = false;

export function useTimeline({
	playback,
	player,
	updateInterval = 250,
	events,
}: UseTimelineConfig = {}) {
	const currentTimerId = useRef<number>(-1);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration, durationRef] = useStateRef(0);
	const [isSeeking, setIsSeeking, isSeekingRef] = useStateRef(false);
	const [currentProgress, setCurrentProgress] = useState(0);
	const [seekRange, setSeekRange, seekRangeRef] = useStateRef<SeekRange>({
		start: 0,
		end: 0,
	});

	useEffect(() => {
		const updateSeekHandler = () => {
			clearInterval(currentTimerId.current);

			currentTimerId.current = window.setInterval(() => {
				if (playback.readyState === 0) return;

				const currentSeekRange = player.seekRange();

				if (player.isLive()) {
					setSeekRange(currentSeekRange);

					setCurrentTime(playback.currentTime);

					const currentDuration =
						currentSeekRange.end - currentSeekRange.start;

					if (durationRef.current !== currentDuration)
						setDuration(currentDuration);

					let localProgress =
						100 -
						((currentSeekRange.end - playback.currentTime) /
							currentDuration) *
							100;

					localProgress = clamp(localProgress, 0, 100);

					if (!isSeekingRef.current)
						setCurrentProgress(localProgress);
				} else {
					if (durationRef.current !== playback.duration)
						setDuration(playback.duration);

					if (
						seekRangeRef.current.start === 0 &&
						seekRangeRef.current.end === 0
					)
						setSeekRange(player.seekRange());

					setCurrentTime(playback.currentTime);

					const localProgress =
						(playback.currentTime / playback.duration) * 100;

					if (!isSeekingRef.current)
						setCurrentProgress(localProgress);
				}
			}, updateInterval);
		};

		// FIX: Putting an object out of the scope of the useEffect hook can lead to useEffect running on each re-render
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
	}, [playback, player, events, updateInterval]);

	return {
		currentTime,
		duration,
		isSeeking,
		currentProgress,
		seekRange,
		setIsSeeking,
		setCurrentProgress,
		setCurrentTime,
	};
}
