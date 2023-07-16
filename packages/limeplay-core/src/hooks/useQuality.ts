import { useCallback, useEffect, useRef, useState } from 'react';
import { useStateRef } from '../utils';
import { useLimeplay } from '../components';

export interface UseQualityConfig {
	clearBufferOnChange?: 'auto' | boolean;
	safeMargin?: number;
}

export function useQuality({
	clearBufferOnChange = 'auto',
	safeMargin = 0,
}: UseQualityConfig) {
	const { playerRef } = useLimeplay();
	const player = playerRef.current;
	const loadMode = useRef(player?.getLoadMode());
	const [tracks, setTracks] = useState<shaka.extern.Track[]>([]);
	const [selectedTrack, setSelectedTrack, selectedTrackRef] =
		useStateRef<shaka.extern.Track | null>(null);
	const [isAuto, setIsAuto, isAutoRef] = useStateRef(false);
	const previousTrack = useRef<shaka.extern.Track | null>(null);

	function setAutoMode() {
		const config = {
			abr: {
				enabled: true,
			},
		};

		player.configure(config);
		setIsAuto(true);
	}

	const selectTrack = useCallback(
		(track: shaka.extern.Track) => {
			const config = {
				abr: {
					enabled: false,
				},
			};

			player.configure(config);
			setIsAuto(false);

			if (
				clearBufferOnChange === 'auto' &&
				previousTrack.current &&
				selectedTrackRef.current
			) {
				if (
					previousTrack.current.bandwidth <
					selectedTrackRef.current.bandwidth
				) {
					player.selectVariantTrack(track, true, safeMargin);
				} else {
					player.selectVariantTrack(track, false, safeMargin);
				}
			} else {
				player.selectVariantTrack(
					track,
					Boolean(clearBufferOnChange),
					safeMargin
				);
			}
		},
		[clearBufferOnChange, safeMargin]
	);

	const updateQualityHandler = useCallback(() => {
		const currConfig = player.getConfiguration();
		let currTracks = player.getVariantTracks();
		const currSelectedTrack = currTracks.find((track) => track.active);

		if (currConfig.abr.enabled !== isAutoRef.current) {
			setIsAuto(currConfig.abr.enabled);
		}

		if (currSelectedTrack) {
			currTracks = currTracks.filter((track, idx) => {
				const otherIdx = player.isAudioOnly()
					? currTracks.findIndex(
							(t) => t.bandwidth === track.bandwidth
					  )
					: currTracks.findIndex((t) => t.height === track.height);
				return otherIdx === idx;
			});
		}

		if (player.isAudioOnly()) {
			currTracks.sort((a, b) => a.bandwidth - b.bandwidth);
		} else {
			currTracks.sort((a, b) => a.height - b.height);
		}

		setSelectedTrack((prevTrack) => {
			previousTrack.current = prevTrack;
			return currSelectedTrack || null;
		});
		setTracks(currTracks);
	}, []);

	// FIXME: This will never trigger as Ref is not updated
	useEffect(() => {
		if (player) {
			const _config = player.getConfiguration();
			updateQualityHandler();
			setIsAuto(_config.abr.enabled);
		}
	}, [updateQualityHandler, loadMode.current]);

	useEffect(() => {
		const events = [
			'variantchanged',
			'abrstatuschanged',
			'trackschanged',
			'adaptation',
		];

		events.forEach((event) => {
			player.addEventListener(event, updateQualityHandler);
		});

		return () => {
			if (player) {
				events.forEach((event) => {
					player.removeEventListener(event, updateQualityHandler);
				});
			}
		};
	}, [updateQualityHandler]);

	return {
		tracks,
		selectedTrack,
		isAuto,
		selectTrack,
		setAutoMode,
	} as const;
}
