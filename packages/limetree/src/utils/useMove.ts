/* eslint-disable no-use-before-define */
import { useEffect, useState, useRef } from 'react';

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export interface UseMovePosition {
	x: number;
	y: number;
}

export const clampUseMovePosition = (position: UseMovePosition) => ({
	x: clamp(position.x, 0, 1),
	y: clamp(position.y, 0, 1),
});

interface useMoveHandlers {
	onScrubStart?(): void;
	onScrubEnd?(): void;
}

export function useMove<T extends HTMLElement = HTMLDivElement>(
	onChange: (value: UseMovePosition) => void,
	handlers?: useMoveHandlers,
	dir: 'ltr' | 'rtl' = 'ltr'
) {
	const ref = useRef<T>();
	const mounted = useRef<boolean>(false);
	const isSliding = useRef(false);
	const frame = useRef(0);
	const [active, setActive] = useState(false);

	useEffect(() => {
		mounted.current = true;
	}, []);

	console.log('useMove: onChange');

	useEffect(() => {
		const onScrub = ({ x, y }: UseMovePosition) => {
			cancelAnimationFrame(frame.current);

			frame.current = requestAnimationFrame(() => {
				if (mounted.current && ref.current) {
					ref.current.style.userSelect = 'none';
					const rect = ref.current.getBoundingClientRect();

					if (rect.width && rect.height) {
						// eslint-disable-next-line no-underscore-dangle
						const _x = clamp((x - rect.left) / rect.width, 0, 1);
						onChange({
							x: dir === 'ltr' ? _x : 1 - _x,
							y: clamp((y - rect.top) / rect.height, 0, 1),
						});
					}
				}
			});
		};

		const bindEvents = () => {
			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', stopScrubbing);
			document.addEventListener('touchmove', onTouchMove);
			document.addEventListener('touchend', stopScrubbing);
		};

		const unbindEvents = () => {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', stopScrubbing);
			document.removeEventListener('touchmove', onTouchMove);
			document.removeEventListener('touchend', stopScrubbing);
		};

		const startScrubbing = () => {
			if (!isSliding.current && mounted.current) {
				isSliding.current = true;
				if (typeof handlers?.onScrubStart === 'function')
					handlers.onScrubStart();
				setActive(true);
				bindEvents();
			}
		};

		const stopScrubbing = () => {
			if (isSliding.current && mounted.current) {
				isSliding.current = false;
				setActive(false);
				unbindEvents();
				setTimeout(() => {
					if (typeof handlers?.onScrubEnd === 'function')
						handlers.onScrubEnd();
				}, 0);
			}
		};

		const onMouseDown = (event: MouseEvent) => {
			startScrubbing();
			event.preventDefault();
			onMouseMove(event);
		};

		const onMouseMove = (event: MouseEvent) =>
			onScrub({ x: event.clientX, y: event.clientY });

		const onTouchStart = (event: TouchEvent) => {
			if (event.cancelable) {
				event.preventDefault();
			}

			startScrubbing();
			onTouchMove(event);
		};

		const onTouchMove = (event: TouchEvent) => {
			if (event.cancelable) {
				event.preventDefault();
			}

			onScrub({
				x: event.changedTouches[0].clientX,
				y: event.changedTouches[0].clientY,
			});
		};

		if (ref.current) {
			ref.current.addEventListener('mousedown', onMouseDown);
			ref.current.addEventListener('touchstart', onTouchStart, {
				passive: false,
			});
		}

		return () => {
			const elementRef = ref.current;
			if (elementRef) {
				elementRef.removeEventListener('mousedown', onMouseDown);
				elementRef.removeEventListener('touchstart', onTouchStart);
			}
		};
	}, [dir, onChange]);

	return { ref, active };
}
