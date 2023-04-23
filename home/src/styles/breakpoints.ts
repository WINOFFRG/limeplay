/** The supported screen sizes. */
export type Screen = 'mobile' | 'tablet' | 'laptop' | 'desktop';

/** The breakpointValues for each screen size. */
export const breakpointValues = {
	mobile: 640,
	tablet: 768,
	laptop: 1024,
	desktop: 1280,
};

/** Media queries mixins for each screen size. */
export const screens = {
	mobile: `@media (max-width: ${breakpointValues.mobile}px)`,
	tablet: `@media (max-width: ${breakpointValues.tablet}px)`,
	laptop: `@media (max-width: ${breakpointValues.laptop}px)`,
	desktop: `@media (max-width: ${breakpointValues.desktop}px)`,
};

export const breakpoints = {
	max: {
		mobile: `@media (max-width: ${breakpointValues.mobile}px)`,
		tablet: `@media (max-width: ${breakpointValues.tablet}px)`,
		laptop: `@media (max-width: ${breakpointValues.laptop}px)`,
		desktop: `@media (max-width: ${breakpointValues.desktop}px)`,
	},
	min: {
		mobile: `@media (min-width: ${breakpointValues.mobile}px)`,
		tablet: `@media (min-width: ${breakpointValues.tablet}px)`,
		laptop: `@media (min-width: ${breakpointValues.laptop}px)`,
		desktop: `@media (min-width: ${breakpointValues.desktop}px)`,
	},
};
