import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
	title: {
		marginTop: `calc(${theme.spacing.xl} * 1.2)`,
		marginBottom: theme.spacing.md,
		wordBreak: 'break-word',
		color: theme.colorScheme === 'dark' ? theme.white : theme.black,
	},

	link: {
		...theme.fn.focusStyles(),
		textDecoration: 'none',
		color: 'inherit',
	},

	offset: {
		position: 'relative',
		top: -62,
	},
}));
