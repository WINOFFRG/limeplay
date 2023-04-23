import { ColorToolsLegacy } from './ColorToolsLegacy';
import { makeStyles } from './theme';

export const useCommonStyles = makeStyles()((theme) => ({
	layoutContent: {
		paddingLeft: 'var(--page-padding-left)',
		paddingRight: 'var(--page-padding-right)',
		maxWidth: 'var(--page-max-width)',
		width: '100%',
		margin: '0 auto',
	},

	flex: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},

	textSelection: {
		'&::selection, & *::selection': {
			background: ColorToolsLegacy.hexWithAlpha('#666be2', 0.6),
		},
	},
}));
