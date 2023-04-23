import { createMakeAndWithStyles } from 'tss-react';
import createCache from '@emotion/cache';
import { breakpoints } from './breakpoints';

const glassGlobalTheme = {
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
	isDark: true,
	breakpoints,
};

type GlobalTheme = typeof glassGlobalTheme;

const themes = {
	glass: glassGlobalTheme,
};

export { themes };
export type { GlobalTheme };

const cache = createCache({
	key: 'tss',
});

export const { makeStyles, withStyles, useStyles } = createMakeAndWithStyles({
	useTheme: () => themes.glass,
	cache,
});
