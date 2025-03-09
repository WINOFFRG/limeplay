import React from 'react';
// import { UnreachableCaseError } from '@/errors/UnreachableCaseError';
// import { usePrevious } from '@/hooks/usePrevious';
import { useStore } from '@/hooks/useStore';

/** Imperatively calls media APIs based on React state, e.g. paused, volume, playbackRate */
export const useSyncMediaState = () => {
	const mediaRef = useStore((state) => state.mediaRef);
	const status = useStore((state) => state.status);
	const volume = useStore((state) => state.volume);
	const playbackRate = useStore((state) => state.playbackRate);
	const muted = useStore((state) => state.muted);
	const loop = useStore((state) => state.loop);
	// const previousStatus = usePrevious(status);

	console.log({ status });

	React.useEffect(() => {
		if (!mediaRef?.current) {
			return;
		}

		// if (previousStatus === 'init') {
		// 	return;
		// }

		if (
			(status === 'paused' || status === 'stopped') &&
			!mediaRef.current.paused
		) {
			mediaRef.current.pause();
		} else if (status === 'playing' && mediaRef.current.paused) {
			mediaRef.current.play().catch((error) => {
				// eslint-disable-next-line no-console
				console.error('Error playing media', error);
				// store.dispatch({ status: 'error', error });
			});
		}
	}, [status]);

	React.useEffect(() => {
		if (mediaRef?.current) {
			mediaRef.current.volume = volume;
		}
	}, [volume]);

	React.useEffect(() => {
		if (mediaRef?.current) {
			mediaRef.current.playbackRate = playbackRate;
		}
	}, [playbackRate]);

	React.useEffect(() => {
		if (mediaRef?.current) {
			mediaRef.current.muted = muted;
		}
	}, [muted]);

	React.useEffect(() => {
		if (mediaRef?.current) {
			switch (loop) {
				case true: {
					mediaRef.current.loop = true;
					break;
				}
				case false: {
					mediaRef.current.loop = false;
					break;
				}
				default: {
					// throw new UnreachableCaseError(loop);
				}
			}
		}
	}, [loop]);

	// We intentionally do not set currentTime because the browser should handle it.
	// We just keep our React state in sync, and manually call .currentTime when seeking.
};
