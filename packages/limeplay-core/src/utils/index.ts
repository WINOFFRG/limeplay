/* eslint-disable no-restricted-syntax */
export { default as getPercentage } from './get-percentage';
export { default as getDuration } from './get-duration';
export { default as useStateRef } from './use-state-ref';
export * from './logger';

type EventMapFor<Target> = Target extends Window
	? WindowEventMap
	: Target extends Document
	? DocumentEventMap
	: Target extends HTMLElement
	? HTMLElementEventMap
	: Target extends EventTarget
	? { [key: string]: Event }
	: never;

export const on = <
	T extends Window | Document | HTMLElement | EventTarget,
	K extends keyof EventMapFor<T> & string
>(
	target: T,
	eventNames: K[] | K,
	listener: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
) => {
	if (Array.isArray(eventNames)) {
		eventNames.forEach((eventName) =>
			target.addEventListener(eventName, listener, options)
		);
	} else {
		target.addEventListener(eventNames, listener, options);
	}
};

export const off = <
	T extends Window | Document | HTMLElement | EventTarget,
	K extends keyof EventMapFor<T> & string
>(
	target: T,
	eventNames: K[] | K,
	listener: EventListenerOrEventListenerObject,
	options?: boolean | EventListenerOptions
) => {
	if (Array.isArray(eventNames)) {
		eventNames.forEach((eventName) =>
			target.removeEventListener(eventName, listener, options)
		);
	} else {
		target.removeEventListener(eventNames, listener, options);
	}
};
