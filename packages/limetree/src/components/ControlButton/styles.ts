import { createStyles, px } from '@mantine/styles';

const useStyles = createStyles((theme) => ({
	controlButton: {
		backgroundColor: 'transparent',
		borderRadius: '0.2rem',
		border: 'none',
		color: theme.white,
		cursor: 'pointer',
		margin: 0,
		padding: 0,
		position: 'relative',
		width: 2 * px(theme.spacing.lg),
		height: 2 * px(theme.spacing.lg),
		opacity: 0.7,
		transition: 'opacity 150ms ease, transform 150ms ease',
		willChange: 'opacity, transform',
		...theme.fn.focusStyles(),

		'&:hover, &:focus-visible': {
			opacity: 1,
			transform: 'scale(1.15)',
		},

		'&:disabled': {
			opacity: 0.3,
			cursor: 'not-allowed',
			transform: 'none',
		},
	},

	controlElementWrapper: {
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
}));

export default useStyles;
