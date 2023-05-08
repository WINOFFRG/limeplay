import { CSSObject } from 'tss-react';
import { GlobalTheme } from './theme';

export const fontFamily = (fontType: 'regular' | 'monospace' | 'emoji') =>
	`var(--font-${fontType})`;

function globalCss(theme: GlobalTheme): CSSObject {
	return {
		'*, *::before, *::after': {
			boxSizing: 'border-box',
		},
		':root': {
			'--header-height': '56px',
			'--page-padding-default': '32px',
			'--page-max-width': '1200px',
			'--page-padding-left':
				'max(env(safe-area-inset-left), var(--page-padding-default))',
			'--page-padding-right':
				'max(env(safe-area-inset-right), var(--page-padding-default))',
			'--page-padding-y': '120px',

			/* Z-indeces */
			'--layer-header': 100,
			'--layer-footer': 50,

			/* Font stacks */
			'--font-monospace':
				'"SFMono Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
			'--font-regular':
				'"UncutSans", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
			'--font-emoji':
				'"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Twemoji Mozilla", "Noto Color Emoji", "Android Emoji"',

			/* Font weights */
			'--font-weight-regular': 410,
			'--font-weight-medium': 510,
			'--font-weight-semibold': 560,
			'--font-weight-bold': 660,

			/* Transition tokens */
			'--speed-highlightFadeIn': '0s',
			'--speed-highlightFadeOut': '0.15s',
			'--speed-quickTransition': '0.1s',
			'--speed-regularTransition': '0.25s',

			/* Masks */
			'--mask-visible': 'black',
			'--mask-invisible': 'transparent',

			/* Misc */
			'--rounded-full': '9999px',
			'--transparent': 'rgba(255, 255, 255, 0)',
			'--min-tap-size': '44px',

			/* Viewport units fallback (see @supports blocks below) */
			'--dvh': '1vh',

			/* Scrollbar */
			'--scrollbar-color': 'rgba(255, 255, 255, 0.2)',
			'--scrollbar-color-active': 'rgba(255, 255, 255, 0.4)',

			'@supports (height: 1dvh)': {
				':root': {
					'--dvh': '1dvh',
				},
			},

			'@media (max-width: 700px)': {
				':root': {
					'--page-padding-y': '48px',
				},
			},

			'@media (max-width: 600px)': {
				':root': {
					'--page-padding-default': '24px',
				},
			},

			'::selection': {
				color: theme.color.controlLabel,
				background: '#4f52b4',
			},
		},

		'html, body': {
			margin: 0,
			padding: 0,
			minHeight: '100vh',
			backgroundColor: theme.color.pageBg,
			colorScheme: theme.isDark ? 'dark' : 'light',
			WebkitTapHighlightColor: 'transparent',
			WebkitTouchCallout: 'none',
			// cv01: alternate 1 glyph
			'--font-settings': 'cv01',
			fontFeatureSettings: 'var(--font-settings)',
			// Disable optical sizing until we're ready…
			'--font-variations': 'opsz auto',
			fontVariationSettings: 'var(--font-variations)',
		},

		html: {
			fontSize: '16px',
			scrollPaddingTop: 'calc(var(--header-height) + 36px)',
			scrollBehavior: 'smooth',
		},

		body: {
			color: theme.color.labelTitle,
			lineHeight: '1.5',

			MozOsxFontSmoothing: 'grayscale',
			WebkitFontSmoothing: 'antialiased',
			textRendering: 'optimizeLegibility',

			msTextSizeAdjust: 'none',
			WebkitTextSizeAdjust: 'none',

			overflowX: 'hidden',
		},

		'svg.logotype': {
			height: 'auto',

			'& > *': {
				fill: 'inherit',
			},
		},

		'body, html, button, input, optgroup, select, textarea': {
			fontFamily: fontFamily('regular'),
		},

		a: {
			textDecoration: 'none',
			cursor: 'pointer',
			color: theme.color.labelLink,
			transition: 'color var(--speed-regularTransition)',
			'&:hover': {
				color: theme.color.labelLinkHover,
			},
		},

		'svg, img': {
			flexShrink: 0,
		},

		'h1, h2, h3, h4, h5, h6': {
			fontWeight: 500,
			lineHeight: 1.22,
			marginTop: '1.8em',
			margin: '0 0 0.5em 0',
			color: theme.color.labelTitle,
		},

		h1: {
			fontSize: '3em',
			fontWeight: 800,
		},

		h2: {
			fontSize: '2.15em',
			fontWeight: 800,
		},

		h3: {
			fontSize: '1.25em',
		},

		h4: {
			fontSize: '1em',
		},

		h5: {
			fontSize: '0.875em',
		},

		h6: {
			fontSize: '0.75em',
		},

		p: {
			lineHeight: 1.5,
		},

		'h1 i, h2 i, h3 i, h4 i': {
			fontWeight: 'normal',
			fontStyle: 'normal',
		},

		'p, dl, ol, ul, pre, blockquote': {
			fontSize: '1.1em',
			marginTop: '0.8em',
			marginBottom: '1.2em',
			color: theme.color.labelTitle,
		},

		'strong, b': {
			fontWeight: 500,
		},

		li: {
			marginBottom: '8px',
			marginLeft: '24px',
		},

		'ul kbd': {
			padding: '0 4px',
			margin: '-4px 2px',
		},

		hr: {
			border: 0,
			height: 0,
			borderTop: `1px solid ${theme.color.bgBorder}`,
		},

		'b, strong': {
			fontWeight: 600,
		},

		'.js-focus-visible :focus:not(.focus-visible)': {
			outline: 'none',
		},

		'.focus-visible': {
			outline: 'none',
			boxShadow: `0 0 0 1px ${theme.color.focusColor}`,
		},
	};
}

export default globalCss;
