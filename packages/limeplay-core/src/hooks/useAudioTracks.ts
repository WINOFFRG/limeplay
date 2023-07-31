import { useCallback, useEffect, useRef, useState } from 'react';
import { useStateRef } from '../utils';
import { useLimeplay } from '../components';

interface AudioTrack {
	track: shaka.extern.Track;
	display: string;
	roles: Set<string>;
	channels: Set<number>;
	language: string;
}

const getRolesString = (track: shaka.extern.Track) => {
	if (track.type === 'variant') {
		return track.audioRoles ? track.audioRoles.join(', ') : undefined;
	}
	return track.roles.join(', ');
};

export function languageParser(locale: string) {
	// Handle some special cases first.  These are reserved language tags that
	// are used to indicate something that isn't one specific language.
	switch (locale) {
		case 'mul':
			return 'Multiple Languages';
		case 'und':
			return 'Default';
		case 'zxx':
			return 'Not applicable';
		default:
			break;
	}

	// If Intl.DisplayNames is supported we prefer it, because the list of
	// languages is up to date.
	if (window.Intl && 'DisplayNames' in Intl) {
		const userLanguage = navigator.language;
		try {
			const languageNames = new Intl.DisplayNames([userLanguage], {
				type: 'language',
			});
			const language = languageNames.of(locale);
			return language.charAt(0).toUpperCase() + language.slice(1);
		} catch (e) {
			// Ignore errors and return the original locale as fallback
			return `Unrecognized (${locale})`;
		}
	}

	const language = shaka.util.LanguageUtils.getBase(locale);

	// First try to resolve the full language name.
	// If that fails, try the base.
	// Finally, report "unknown".
	// When there is a loss of specificity (either to a base language or to
	// "unknown"), we should append the original language code.
	// Otherwise, there may be multiple identical-looking items in the list.
	// if (locale in mozilla.LanguageMapping) {
	// 	return mozilla.LanguageMapping[locale].nativeName;
	// }
	// if (language in mozilla.LanguageMapping) {
	// 	return `${mozilla.LanguageMapping[language].nativeName} (${locale})`;
	// }

	return `Unrecognized (${locale})`;
}

export function useAudioTracks() {
	const { playerRef } = useLimeplay();
	const player = playerRef.current;
	const [tracks, setTracks] = useState<AudioTrack[]>([]);
	const [selectedTrack, setSelectedTrack, selectedTrackRef] =
		useStateRef<AudioTrack | null>(null);
	const previousTrack = useRef<AudioTrack | null>(null);

	const selectTrack = useCallback(
		(track: AudioTrack, role?: string, channelsCount?: number) => {
			role = role ?? track.roles[0];
			channelsCount = channelsCount ?? track.channels[0];

			player.selectAudioLanguage(track.language, role, channelsCount);
		},
		[]
	);

	const updateQualityHandler = useCallback(() => {
		const currTracks = player.getVariantTracks();
		let currSelectedTrack = null;

		const uniqueTracks = new Set<string>();

		const audioTracks: AudioTrack[] = [];

		// CHECKME: Better sort tracks first based on channelCount or maybe no in the end callback just takes language

		currTracks.forEach((track) => {
			if (!uniqueTracks.has(track.language)) {
				uniqueTracks.add(track.language);

				audioTracks.push({
					track,
					display: languageParser(track.language),
					roles: new Set(track.roles),
					channels: new Set([track.channelsCount]),
					language: track.language,
				});
			} else {
				const existingTrack = audioTracks.find(
					(audioTrack) => audioTrack.language === track.language
				);

				track.roles.forEach((role) => existingTrack.roles.add(role));
				existingTrack.channels.add(track.channelsCount);
			}
		});

		currTracks.forEach((track) => {
			if (track.active) {
				currSelectedTrack = audioTracks.find(
					(audioTrack) => audioTrack.language === track.language
				);
			}
		});

		setSelectedTrack((prevTrack) => {
			previousTrack.current = prevTrack;
			return currSelectedTrack ?? null;
		});

		setTracks(audioTracks);
	}, []);

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
		selectTrack,
	} as const;
}
