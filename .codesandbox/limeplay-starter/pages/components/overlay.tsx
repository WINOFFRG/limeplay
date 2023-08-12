// @ts-ignore
import mux from "mux.js";
import { useEffect } from "react";
import { PlaybackControl } from "./playback";
import { useLimeplay, useShakaPlayer } from "@limeplay/core";
import Loader from "./loading";
import { VolumeControl } from "./volume";
import FullscreenControl from "./fullscreen";
import Link from "next/link";

export default function PlayerOverlay() {
	const { isLoaded, error } = useShakaPlayer();
	const data = useLimeplay();
	const player: shaka.Player = data.player;

	useEffect(() => {
		if (!window.muxjs) window.muxjs = mux;

		if (player && isLoaded) {
			player.load(
				"https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8"
			);
		}
	}, [player, isLoaded]);

	if (!isLoaded) return null;

	return (
		<div className='absolute z-10 flex flex-col items-center justify-between h-full p-6 w-full'>
			<section className='flex flex-wrap items-center font-sans text-2xl hover:underline'>
				<Link href={"https://github.com/WINOFFRG/limeplay"}>
					Limeplay Starter
				</Link>
			</section>
			<Loader />
			<section className='flex flex-wrap w-full justify-between'>
				<div className='flex gap-6'>
					<PlaybackControl />
					<VolumeControl />
				</div>
				<FullscreenControl />
			</section>
		</div>
	);
}
