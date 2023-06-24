import { useCallback, useEffect, useRef, useState } from 'react';
import { useStateRef } from '../utils';

export interface UseQualityConfig {
	player?: shaka.Player;
	playback?: HTMLMediaElement;
	events?: ShakaPlayerEvents;
	clearBufferOnChange?: 'auto' | boolean;
	safeMargin?: number;
}

export function useQuality({
	playback,
	player,
	events = [
		'variantchanged',
		'abrstatuschanged',
		'trackschanged',
		'adaptation',
	],
	clearBufferOnChange = 'auto',
	safeMargin = 0,
}: UseQualityConfig) {
	const loadMode = useRef(player?.getLoadMode());
	const [tracks, setTracks] = useState<shaka.extern.Track[]>([]);
	const [selectedTrack, setSelectedTrack, selectedTrackRef] =
		useStateRef<shaka.extern.Track | null>(null);
	const [isAuto, setIsAuto] = useState(false);
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
		[player, clearBufferOnChange, safeMargin]
	);

	const updateQualityHandler = useCallback(() => {
		let currTracks = player.getVariantTracks();
		const currSelectedTrack = currTracks.find((track) => track.active);

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
	}, [player]);

	useEffect(updateQualityHandler, [updateQualityHandler, loadMode.current]);

	useEffect(() => {
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
	}, [player, events, updateQualityHandler]);

	return {
		tracks,
		selectedTrack,
		isAuto,
		selectTrack,
		setAutoMode,
	};
}
