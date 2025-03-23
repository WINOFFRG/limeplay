import { useEffect } from 'react';
import { PlaybackControl } from './playback';
import { useLimeplay, useShakaPlayer } from '@limeplay/core';
import Loader from './loading';
import { VolumeControl } from './volume';
import FullscreenControl from './fullscreen';
import Link from 'next/link';

// @ts-ignore
import mux from 'mux.js';
/**
	mux.js is transmuxer for video streaming formats. It is used to convert
	one format to another. The below stream URL example uses the ts
	container format. On some devices it might not be supported.
*/

export default function PlayerOverlay() {
	const { isLoaded, error } = useShakaPlayer();
	const data = useLimeplay();
	const player: shaka.Player = data.player;

	useEffect(() => {
		if (!window.muxjs) window.muxjs = mux;

		/**
			Manage all your custom player logic here. Player configurations like DRM, Streaming
			should be done here. You can also use the player instance to add event listeners
			or error handlers. For more information please refer shaka player documentation.
		 */
		if (player && isLoaded) {
			player.load(
				'https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8'
			);
		}
	}, [player, isLoaded]);

	/**
		isLoaded is the state exposed by useShakaPlayer hook. It is true when
		the shaka player has been instantiated and hooked to the media element.
		You must use any of the limeplay hooks only after this state is true.
	 */
	if (!isLoaded) return null;

	return (
		<div className="absolute z-10 flex flex-col items-center justify-between h-full p-6 w-full">
			<section className="flex flex-wrap items-center font-sans text-2xl hover:underline">
				<Link href={'https://github.com/WINOFFRG/limeplay'}>
					Limeplay Starter
				</Link>
			</section>
			<Loader />
			<section className="flex flex-wrap w-full justify-between">
				<div className="flex gap-6">
					<PlaybackControl />
					<VolumeControl />
				</div>
				<FullscreenControl />
			</section>
		</div>
	);
}
