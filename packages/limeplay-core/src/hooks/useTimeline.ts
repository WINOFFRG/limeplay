import React, { useCallback, useEffect, useRef, useState } from 'react';
import { clamp, useStateRef } from '../utils';
import { useLimeplay } from '../components';

export interface UseTimelineConfig {
	/**
	 * HTMLMediaElement events to listen to
	 * @default Events - ['trackschanged', 'manifestparsed']
	 */
	updateInterval?: number;
	seekAllowed?: boolean;
	updateWhileSliding?: boolean;
	isSlidingRef?: React.MutableRefObject<boolean>;
}

export function useTimeline({
	updateInterval = 250,
	isSlidingRef = React.createRef(),
}: UseTimelineConfig = {}) {
	const { playback, player } = useLimeplay();
	const currentTimerId = useRef<number>(-1);

	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration, durationRef] = useStateRef(0);
	const [currentProgress, setCurrentProgress] = useState(0);
	const [isLive, setIsLive, isLiveRef] = useStateRef(false);
	const [liveLatency, setLiveLatency] = useState(0);
	const [seekRange, setSeekRange, seekRangeRef] = useStateRef<SeekRange>({
		start: 0,
		end: 0,
	});

	const updateCurrentTime = useCallback((time: number) => {
		if (playback.readyState === 0 || Number.isNaN(time)) return;
		const _seekRange = player.seekRange();
		time = clamp(time, _seekRange.start, _seekRange.end);
		playback.currentTime = time;

		/* Even though state updates are managed by events below, but those are in intervals
			means that can cause a delay in update or when intervals aren't running. So, we
			update the state directly here and rest work is later done by events, since updating
			time just affects currentTime state not others. If any more will do same for them!
		*/

		setCurrentTime(time);
	}, []);

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

					if (!isSlidingRef.current)
						setCurrentProgress(localProgress);

					setLiveLatency(currentSeekRange.end - playback.currentTime);
				} else {
					if (durationRef.current !== playback.duration)
						setDuration(playback.duration);

					setSeekRange(player.seekRange());

					setCurrentTime(playback.currentTime);

					const localProgress =
						(playback.currentTime / playback.duration) * 100;

					if (!isSlidingRef.current)
						setCurrentProgress(localProgress);
				}

				if (isLiveRef.current !== player.isLive()) {
					setIsLive(player.isLive());
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
		currentTime,
		duration,
		currentProgress,
		seekRange,
		isLive,
		liveLatency,
		updateCurrentTime,
	} as const;
}
