import { CSSObject } from 'tss-react';
import { GlobalTheme } from './theme';

function nProgressCss(theme: GlobalTheme): CSSObject {
	const nprogressHeight = '2px';

	return {
		'#nprogress': {
			pointerEvents: 'none',
			'--nprogress-height': nprogressHeight,
		},
		'#nprogress .bar': {
			position: 'fixed',
			zIndex: 1000,
			top: 0,
			left: 0,
			width: '100%',
			height: nprogressHeight,
			background: theme.color.controlBase,
		},
		'#nprogress::after': {
			content: '""',
			position: 'fixed',
			zIndex: 500,
			top: 0,
			left: 0,
			width: '100%',
			height: nprogressHeight,
			background: theme.color.bgBorder,
		},
	};
}

export { nProgressCss };
