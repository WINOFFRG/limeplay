import { useEffect, useRef, useState } from 'react';
import clamp from 'lodash/clamp';
import { useGesture } from '@use-gesture/react';
import { shallow } from 'zustand/shallow';
import useStore from '../store';

interface UseTimelineResult {
	currentTime: number;
	duration: number;
	isLive: boolean;
}

export default function useTimeline(
	playback: HTMLMediaElement,
	player: shaka.Player
) {
	const precision = 3;
	const UPDATE_INTERVAL = 500;
	const SEEK_ALLOWED = true;
	const UPDATE_WHILE_SEEKING = false;
	const PAUSE_WHILE_SEEKING = false;

	const {
		currentTime,
		duration,
		isLive,
		liveLatency,
		progress,
		seekRange,
		isSeeking,
	} = useStore(
		(state) => ({
			currentTime: state.currentTime,
			duration: state.duration,
			isLive: state.isLive,
			liveLatency: state.liveLatency,
			progress: state.progress,
			seekRange: state.seekRange,
			isSeeking: state.isSeeking,
		}),
		shallow
	);

	const {
		setCurrentTime,
		setDuration,
		getDuration,
		setIsLive,
		getIsLive,
		setLiveLatency,
		getLiveLatency,
		setProgress,
		setSeekRange,
		setIsSeeking,
		getIsSeeking,
	} = useStore(
		(state) => ({
			setCurrentTime: state.setCurrentTime,
			setDuration: state.setDuration,
			getDuration: state.getDuration,
			setIsLive: state.setIsLive,
			getIsLive: state.getIsLive,
			setLiveLatency: state.setLiveLatency,
			getLiveLatency: state.getLiveLatency,
			setProgress: state.setProgress,
			setSeekRange: state.setSeekRange,
			setIsSeeking: state.setIsSeeking,
			getIsSeeking: state.getIsSeeking,
		}),
		shallow
	);

	const currentTimerId = useRef<number>(-1);

	const cbFunction = ({ event }) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const newValue = ((event.clientX - rect.left) / rect.width) * 100;
		const clammpedValue = clamp(newValue, 0, 100);
		setProgress(clammpedValue);

		if (event.type === 'pointerup' || event.type === 'mousedown') {
			playback.currentTime =
				seekRange.start + (duration * clammpedValue) / 100;
		}
	};

	const bind = useGesture(
		{
			onDrag: cbFunction,
			onMouseUp: () => {
				setIsSeeking(false);
			},
			onMouseDown: ({ event }) => {
				setIsSeeking(true);
				cbFunction({ event });
			},
		},
		{
			drag: {
				axis: 'x',
				filterTaps: false,
			},
			enabled: playback.readyState > 2,
		}
	);

	useEffect(() => {
		const updateSeekHandler = () => {
			clearInterval(currentTimerId.current);
			setIsLive(player.isLive());

			currentTimerId.current = window.setInterval(() => {
				if (getIsLive()) {
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

					let localProgress =
						((player.seekRange().end - playback.currentTime) /
							(player.seekRange().end -
								player.seekRange().start)) *
						100;

					localProgress = 100 - localProgress;

					localProgress = localProgress < 0 ? 0 : localProgress;

					localProgress = Number(localProgress.toFixed(precision));

					if (!getIsSeeking()) setProgress(localProgress);

					if (getIsLive() !== player.isLive()) {
						setIsLive(player.isLive());
					}
				} else {
					setDuration(playback.duration);

					if (getLiveLatency() !== -1) setLiveLatency(-1);

					if (seekRange.start === 0 || seekRange.end === 0)
						setSeekRange(player.seekRange());

					setCurrentTime(playback.currentTime);

					let localProgress =
						(playback.currentTime / playback.duration) * 100;

					localProgress = Number(localProgress.toFixed(precision));

					if (!getIsSeeking()) setProgress(localProgress);
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
		progress,
		isSeeking,
		bind,
	};
}
