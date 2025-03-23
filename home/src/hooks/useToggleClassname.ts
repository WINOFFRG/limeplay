import * as React from 'react';

/**
 * Returns a ref and a trigger to toggle a classname on an element.
 * This is useful for playing or restarting a CSS animation imperatively.
 */
export const useToggleClassname = <T extends HTMLElement>(
	className: string
): [React.RefObject<T>, () => void] => {
	const ref = React.useRef<T>(null);

	const trigger = React.useCallback(() => {
		if (ref.current) {
			ref.current.classList.remove(className);
			// eslint-disable-next-line no-void
			void ref.current.offsetWidth;
			ref.current.classList.add(className);
		}
	}, []);

	return [ref, trigger];
};
