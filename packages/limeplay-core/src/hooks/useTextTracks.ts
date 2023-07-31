import React, { useCallback, useEffect, useRef, useState } from 'react';
import shaka from 'shaka-player';
import { useStateRef } from '../utils';
import { useLimeplay } from '../components';
import { languageParser } from './useAudioTracks';

interface SubtitleTrack {
	track: shaka.extern.Track;
	display: string;
	roles: Set<string>;
	language: string;
}

export function useTextTracks() {
	const { playerRef, playbackRef } = useLimeplay();
	const player = playerRef.current;
	const [tracks, setTracks] = useState<SubtitleTrack[]>([]);
	const [selectedTrack, setSelectedTrack, selectedTrackRef] =
		useStateRef<SubtitleTrack | null>(null);
	const previousTrack = useRef<SubtitleTrack | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	const selectTrack = useCallback((track: SubtitleTrack) => {
		player.selectTextTrack(track.track);
		player.setTextTrackVisibility(true);
	}, []);

	const toggleVisibility = () => {
		player.setTextTrackVisibility(!isVisible);
	};

	const trackHandler = () => {
		console.log('trackHandler');

		const currTracks = player.getTextTracks();
		let currSelectedTrack = null;
		const uniqueTracks = new Set<string>();

		const subtitleTracks: SubtitleTrack[] = [];

		// CHECKME: Better sort tracks first based on channelCount or maybe no in the end callback just takes language

		currTracks.forEach((track) => {
			if (!uniqueTracks.has(track.language)) {
				uniqueTracks.add(track.language);

				subtitleTracks.push({
					track,
					display: languageParser(track.language),
					roles: new Set(track.roles),
					language: track.language,
				});
			} else {
				const existingTrack = subtitleTracks.find(
					(audioTrack) => audioTrack.language === track.language
				);

				track.roles.forEach((role) => existingTrack.roles.add(role));
			}
		});

		currTracks.forEach((track) => {
			if (track.active) {
				currSelectedTrack = subtitleTracks.find(
					(audioTrack) => audioTrack.language === track.language
				);
			}
		});

		setSelectedTrack((prevTrack) => {
			previousTrack.current = prevTrack;
			return currSelectedTrack ?? null;
		});

		setTracks(subtitleTracks);
		setIsVisible(player.isTextTrackVisible());
	};

	useEffect(() => {
		const events = ['texttrackvisibility', 'textchanged', 'trackschanged'];

		events.forEach((event) => {
			player.addEventListener(event, trackHandler);
		});

		return () => {
			if (player) {
				events.forEach((event) => {
					player.removeEventListener(event, trackHandler);
				});
			}
		};
	}, [trackHandler]);

	return {
		tracks,
		selectedTrack,
		isVisible,
		selectTrack,
		toggleVisibility,
	} as const;
}
