'use client';

import { useStore } from '@/hooks/useStore';
import { Media, useSyncMediaState } from '@limeplay/core';
import { useEffect } from 'react';
import { PlayerContainer } from './PlayerContainer';
import { ControlsContainer } from './ControlsContainer';
import dynamic from 'next/dynamic';

const ShakaProvider = dynamic(
	() => import('@limeplay/core').then((mod) => mod.ShakaProvider),
	{
		ssr: false,
	}
);

export function VideoPlayer() {
	const player = useStore((state) => state.player);
	useSyncMediaState();

	useEffect(() => {
		if (player) {
			player.load('https://files.vidstack.io/sprite-fight/1080p.mp4');
		}
	}, [player]);

	return (
		<PlayerContainer>
			<ShakaProvider>
				<div className="relative overflow-hidden w-full rounded-lg max-w-7xl mx-auto">
					<Media
						as={'video'}
						className="w-full h-full object-cover bg-black rounded-lg"
						src="/video.mp4"
						autoPlay
						muted
						loop
					/>
					<ControlsContainer />
				</div>
			</ShakaProvider>
		</PlayerContainer>
	);
}
