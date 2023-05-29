import type { AppProps } from 'next/app';
import { createEmotionSsrAdvancedApproach } from 'tss-react/next/pagesDir';
import { Analytics } from '@vercel/analytics/react';
import { MantineProvider } from '@mantine/styles';
import { MetaTags } from '@/components/Layout/MetaTags';

const { augmentDocumentWithEmotionCache } = createEmotionSsrAdvancedApproach({
	key: 'tss',
});

export { augmentDocumentWithEmotionCache };

export const fontFamily = (fontType: 'regular' | 'monospace' | 'emoji') =>
	`var(--font-${fontType})`;

export default function App({ Component, pageProps }: AppProps) {
	return (
		<MantineProvider
			theme={{
				other: {
					color: {
						pageBg: '#000212',
						bgBase: '#191A23',
						bgSub: '#181922',
						bgBaseHover: '#1c1d2a',
						bgShade: '#21232E',
						bgBorder: '#2c2d3c',
						bgBorderThin: '#2c2d3c',
						bgBorderFaint: '#212234',
						bgBorderFaintThin: '#212234',
						bgBorderSolid: '#313248',
						bgBorderSolidThin: '#3E3E4A',
						bgSelected: '#2a2a3f',

						bgSelectedHover: '#242546',
						bgSelectedBorder: '#333567',
						bgModalOverlay: '#191A2340',

						labelFaint: '#4c4f6b',
						labelMuted: '#858699',
						labelBase: '#D2D3E0',
						labelTitle: '#EEEFFC',
						labelLink: '#6c79ff',
						labelLinkHover: '#7c8aff',

						controlLabel: '#FFFFFF',
						controlSelectedBg: '#272832',
						controlBase: '#575BC7',
						controlBaseHighlight: '#666be2',
						controlSecondary: '#292a35',
						controlSelectLabel: '#EEEFFC',
						controlSecondaryHighlight: '#2C2D42',

						focusColor: '#6c79ff',
					},
				},
				globalStyles: (theme) => ({
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
							color: theme.other.color.controlLabel,
							background: '#4f52b4',
						},
					},

					'html, body': {
						margin: 0,
						padding: 0,
						minHeight: '100vh',
						backgroundColor: theme.other.color.pageBg,
						colorScheme: 'dark',
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
						color: theme.other.color.labelTitle,
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
						color: theme.other.color.labelLink,
						transition: 'color var(--speed-regularTransition)',
						'&:hover': {
							color: theme.other.color.labelLinkHover,
						},
					},
				}),
			}}
		>
			<MetaTags />
			<Component {...pageProps} />
			<Analytics />
		</MantineProvider>
	);
}
