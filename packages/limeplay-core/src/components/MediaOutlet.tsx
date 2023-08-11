import React, { forwardRef, useLayoutEffect } from 'react';
import { useComposedRefs } from '../utils/composeRefs';
import { useLimeplay } from './LimeplayProvider';

export const MediaOutlet = forwardRef(
	({ children }: { children: React.ReactNode }, forwardedRef) => {
		const { playbackRef, setPlayback } = useLimeplay();
		const composedRefs = useComposedRefs(forwardedRef, playbackRef);

		useLayoutEffect(() => {
			if (React.Children.count(children) !== 1) {
				throw new Error(
					'MediaOutlet must have a single child as HTMLMediaElement'
				);
			}

			if (!React.isValidElement(children)) {
				throw new Error(
					'MediaOutlet must have a single child as HTMLMediaElement'
				);
			}

			if (playbackRef.current) {
				setPlayback(playbackRef.current);
			}
		}, [children]);

		return (
			<>
				{React.cloneElement(children as React.ReactElement, {
					ref: composedRefs,
				})}
			</>
		);
	}
);
