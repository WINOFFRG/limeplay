import React, { useEffect, useRef } from 'react';
import { useLimeplayStore } from '../../store';
import { useComposedRefs } from '../../utils/composeRefs';

export const MediaOutlet = React.forwardRef(
	({ children }: { children: React.ReactNode }, forwardedRef) => {
		const setPlayback = useLimeplayStore((state) => state.setPlayback);
		const playbackRef = useRef<HTMLMediaElement>(null);
		const composedRefs = useComposedRefs(forwardedRef, playbackRef);

		useEffect(() => {
			if (React.Children.count(children) !== 1) {
				throw new Error(
					'MediaOutlet must have a single child as HTMLMediaElement'
				);
			}

			if (playbackRef.current) {
				setPlayback(playbackRef.current);
			}

			return () => {
				setPlayback(null);
			};
		}, [children, setPlayback]);

		return (
			<>
				{React.cloneElement(children as React.ReactElement, {
					ref: composedRefs,
				})}
			</>
		);
	}
);
