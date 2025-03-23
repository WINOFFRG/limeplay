import { CSSObject } from '@mantine/styles';

export function moreHitArea(
	pixelsOrTop: number,
	right?: number,
	bottom?: number,
	left?: number,
	addPositioning = true
): any {
	const css: CSSObject = {
		position: addPositioning ? 'relative' : 'initial',
		'&::before': {
			position: 'absolute',
			content: '""',
			top: `-${pixelsOrTop}px`,
			right: `-${right ?? pixelsOrTop}px`,
			left: `-${left ?? pixelsOrTop}px`,
			bottom: `-${bottom ?? pixelsOrTop}px`,
		},
	};
	return css;
}

export function gradientBorder(size: number, gradient: string): any {
	const css: CSSObject = {
		position: 'relative',

		'&::before': {
			content: '""',
			pointerEvents: 'none',
			userSelect: 'none',
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			borderRadius: 'inherit',
			padding: `${size}px`,
			background: gradient,

			mask: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
			WebkitMaskComposite: 'xor',
			maskComposite: 'exclude',
		},
	};
	return css;
}
