import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { Slot } from '@radix-ui/react-slot';
import { useStore } from '@/hooks/useStore';

export interface PlaybackControlProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	asChild?: boolean;
}

/**
 * Play/pause toggle `<button>`
 * @note provides the current state as a render function prop
 */
export const PlaybackControl = React.forwardRef<
	HTMLButtonElement,
	PlaybackControlProps
>((props, forwardedRef) => {
	const status = useStore((state) => state.status);
	const paused = useStore((state) => state.paused);
	const setPaused = useStore((state) => state.setPaused);
	const Comp = props.asChild ? Slot : 'button';

	return (
		<Comp
			// TODO(paco): this should maybe be focused when the media player is idle? it feels weird to leave focus on the fullscreen button after clicking it, the next keypress might be "space" to pause, but instead will trigger the fullscreen button again
			// maybe we should focus here when fullscreen becomes active or inactive, instead
			{...props}
			ref={forwardedRef}
			aria-label={
				['paused', 'ended'].includes(status)
					? `Play (keyboard shortcut k)`
					: `Pause (keyboard shortcut k)`
			}
			aria-keyshortcuts="k"
			onClick={composeEventHandlers(props.onClick, (e) => {
				// Manually move focus to the PlaybackControl when clicking
				// Safari doesn't do this by default for any buttons (https://bugs.webkit.org/show_bug.cgi?id=22261)
				// But it's important here so that pressing spacebar to play/pause works
				e.currentTarget.focus();
				setPaused(!paused);
			})}
		/>
	);
});
