import { createStyles } from '@mantine/styles';

export const useCommonStyles = createStyles((theme) => ({
	layoutContent: {
		paddingLeft: 'var(--page-padding-left)',
		paddingRight: 'var(--page-padding-right)',
		maxWidth: 'var(--page-max-width)',
		margin: '0 auto',
	},
}));
