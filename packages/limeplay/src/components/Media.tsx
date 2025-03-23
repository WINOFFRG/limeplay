import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { composeRefs } from '@radix-ui/react-compose-refs';
import { useStore } from '@/hooks/useStore';
// import { MediaStoreContext } from './context/MediaStoreContext';

/** Generic media element, which Video and Audio extend. */
export const Media = React.forwardRef<
	HTMLMediaElement,
	React.MediaHTMLAttributes<HTMLMediaElement> & {
		as: 'video' | 'audio';
	}
>((props, forwardedRef) => {
	const { as: Element = 'video', ...etc } = props;
	// const store = React.useContext(MediaStoreContext);
	const mediaRef = React.useRef<HTMLMediaElement>(null);
	const setMediaRef = useStore((state) => state.setMediaRef);
	const status = useStore((state) => state.status);
	const setStatus = useStore((state) => state.setStatus);
	const setDuration = useStore((state) => state.setDuration);
	const loop = useStore((state) => state.loop);
	const [waiting, setWaiting] = React.useState(false);

	// The video may load faster than React mounts the component
	// so attached event listeners like `onDurationChange` won't fire
	// We need to manually check if the video is ready after mount
	React.useEffect(() => {
		if (!mediaRef?.current) {
			return;
		}

		setMediaRef(mediaRef);

		// Check if the media has audio
		// dispatch({ hasAudio: hasAudio(mediaRef.current) });

		// There was an error, not ready!
		if (mediaRef.current.error) {
			// eslint-disable-next-line no-console
			console.error(mediaRef.current.error);
			// store.dispatch({ error: mediaRef.current.error });
			return;
		}

		console.log('mediaRef.current.readyState', mediaRef.current.readyState);

		// Ready to play at least 1 frame of the media
		if (mediaRef.current.readyState >= 2) {
			const shouldAutoplay = mediaRef.current.autoplay;
			setStatus(shouldAutoplay ? 'playing' : 'paused');
			setDuration(mediaRef.current.duration);
		}
	}, []);

	// React.useEffect(() => {
	// 	function handle() {
	// 		// store.dispatch({ type: 'WAITING' });
	// 	}

	// 	if (waiting) {
	// 		const bufferingTimer = setTimeout(handle, 1000);
	// 		return () => clearTimeout(bufferingTimer);
	// 	} else {
	// 		// store.dispatch({ type: 'RESUME' });
	// 	}

	// 	// return;
	// }, [waiting]);

	return (
		<Element
			crossOrigin="anonymous"
			{...etc}
			// ref={composeRefs(forwardedRef, mediaRef)}
			ref={composeRefs(forwardedRef, mediaRef)}
			aria-busy={status === 'buffering'}
			// onDurationChange={composeEventHandlers(
			// 	props.onDurationChange,
			// 	(e) => {
			// 		store.dispatch({ duration: e.currentTarget.duration });
			// 	},
			// 	{ checkForDefaultPrevented: false }
			// )}
			// onTimeUpdate={composeEventHandlers(
			// 	props.onTimeUpdate,
			// 	(e) => {
			// 		// Do not set status to `playing` here.
			// 		// The video can call this callback while React is still processing a `paused` action.
			// 		// If we set back to `playing`, we'll be in a loop.
			// 		store.dispatch({
			// 			type: 'SET_CURRENT_TIME',
			// 			currentTime: e.currentTarget.currentTime,
			// 		});
			// 	},
			// 	{ checkForDefaultPrevented: false }
			// )}
			// onVolumeChange={composeEventHandlers(
			// 	props.onVolumeChange,
			// 	(e) => {
			// 		store.dispatch({
			// 			muted: e.currentTarget.muted,
			// 			volume: e.currentTarget.volume,
			// 		});
			// 	},
			// 	{ checkForDefaultPrevented: false }
			// )}
			// // Handle play/pause events fired natively (removing bluetooth headphones, keyboard play/pause, etc.)
			// // useMediaSession() handles this too, but it's not supported before Safari 15
			onPlay={composeEventHandlers(
				props.onPlay,
				() => {
					setStatus('playing');
				},
				{ checkForDefaultPrevented: false }
			)}
			// onPause={composeEventHandlers(
			// 	props.onPause,
			// 	() => {
			// 		store.dispatch({ type: 'PAUSE' });
			// 	},
			// 	{ checkForDefaultPrevented: false }
			// )}
			// onPlaying={composeEventHandlers(
			// 	props.onPlaying,
			// 	() => {
			// 		setWaiting(false);
			// 	},
			// 	{ checkForDefaultPrevented: false }
			// )}
			onEnded={composeEventHandlers(
				props.onEnded,
				() => {
					// Ignore this when looping, since we'll never have an "ended" state
					if (loop) {
						return;
					}

					setStatus('stopped');
				},
				{ checkForDefaultPrevented: false }
			)}
			// onError={composeEventHandlers(
			// 	props.onError,
			// 	(e) => {
			// 		store.dispatch({
			// 			error: e.currentTarget.error ?? undefined,
			// 		});
			// 	},
			// 	{ checkForDefaultPrevented: false }
			// )}
			// onCanPlay={composeEventHandlers(
			// 	props.onCanPlay,
			// 	(e) => {
			// 		store.dispatch({
			// 			canPlay: true,
			// 			duration: e.currentTarget.duration,
			// 		});
			// 	},
			// 	{ checkForDefaultPrevented: false }
			// )}
			// onCanPlayThrough={composeEventHandlers(
			// 	props.onCanPlayThrough,
			// 	(e) => {
			// 		store.dispatch({
			// 			canPlay: true,
			// 			duration: e.currentTarget.duration,
			// 		});
			// 	},
			// 	{ checkForDefaultPrevented: false }
			// )}
			// onWaiting={composeEventHandlers(
			// 	props.onWaiting,
			// 	() => {
			// 		setWaiting(true);
			// 	},
			// 	{ checkForDefaultPrevented: false }
			// )}
			// onProgress={composeEventHandlers(
			// 	props.onProgress,
			// 	(e) => {
			// 		store.dispatch({
			// 			buffered: getActiveBufferedTimeRange(e.currentTarget),
			// 		});
			// 	},
			// 	{ checkForDefaultPrevented: false }
			// )}
		/>
	);
});

/** Extracts media.buffered TimeRange that current player timestamp is in  */
// function getActiveBufferedTimeRange(media: HTMLMediaElement): [number, number] {
// 	const bf = media.buffered;
// 	for (let i = 0; i < bf.length; i++) {
// 		const start = bf.start(i);
// 		const end = bf.end(i);
// 		if (media.currentTime >= start && media.currentTime <= end) {
// 			return [start, end];
// 		}
// 	}
// 	return [0, 0];
// }
