import { createStyles } from '@mantine/styles';
import { ColorToolsLegacy } from './ColorToolsLegacy';

export const useCommonStyles = createStyles((theme) => ({
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
