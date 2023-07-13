/* eslint-disable no-restricted-syntax */
export { default as getPercentage } from './get-percentage';
export { default as getDuration } from './get-duration';
export { default as useStateRef } from './use-state-ref';

export function on<E extends string, A extends readonly unknown[]>(
	arg1:
		| { addEventListener: (event: E, ...args: A) => void }
		| readonly ({
				addEventListener: (event: E, ...args: A) => void;
		  } | null)[]
		| null,
	arg2: E | E[],
	...args: A
): void {
	if (arg1 === null) return;
	if ('addEventListener' in arg1) {
		if (typeof arg2 === 'string') {
			arg1.addEventListener(arg2, ...args);
		} else {
			for (const event of arg2) {
				arg1.addEventListener(event, ...args);
			}
		}
	} else {
		for (const obj of arg1) {
			if (typeof arg2 === 'string') {
				obj?.addEventListener(arg2, ...args);
			} else {
				for (const event of arg2) {
					obj?.addEventListener(event, ...args);
				}
			}
		}
	}
}
