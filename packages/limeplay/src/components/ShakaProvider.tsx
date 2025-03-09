'use client';

import { useEffect } from 'react';
import shaka from 'shaka-player/dist/shaka-player.compiled.debug';

import { useStore } from '@/hooks/useStore';

export function ShakaProvider({ children }: { children: React.ReactNode }) {
	const setPlayer = useStore((state) => state.setPlayer);
	const mediaRef = useStore((state) => state.mediaRef);

	useEffect(() => {
		if (!mediaRef?.current) {
			return;
		}

		const _player = new shaka.Player(mediaRef.current);
		setPlayer(_player);
	}, [mediaRef]);

	return <div>{children}</div>;
}
