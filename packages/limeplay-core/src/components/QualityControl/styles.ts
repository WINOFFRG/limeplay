import { createStyles } from '@mantine/styles';

const useStyles = createStyles((theme, _params, getRef) => ({
	controlButton: {
		display: 'inline-flex',
		alignItems: 'center',
		width: '44px',
		height: '44px',
		opacity: 0.7,
		transition: 'opacity 0.1s ease-in-out',
		backgroundColor: 'transparent',
		border: 'none',
		...theme.fn.focusStyles(),

		'&:hover': {
			opacity: 1,
			cursor: 'pointer',
			transform: 'scale(1.1)',
		},

		'&:disabled': {
			opacity: 0.3,
			cursor: 'not-allowed',
			transform: 'none',
		},
	},

	iconStyle: {
		width: '24px',
		height: '24px',
		margin: 'auto',
		pointerEvents: 'none',
	},

	qualitywrapper: {
		margin: 0,
		padding: 0,
		backgroundColor: 'none',
		background: 'none',
		border: 'none',
		// width: 'rem',
		zIndex: 100,
	},

	qualityContainer: {
		backgroundColor: 'rgba(0, 0, 0, 0.64)',
		backdropFilter: 'blur(10px)',
		borderRadius: '10px',
		padding: '20px',
		paddingLeft: '40px',
		paddingRight: '40px',
		// margin: '10px',
		border: 'none',
	},

	qualityValues: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'center',
		gap: '10px',
		fontFamily: 'Roboto, sans-serif',
	},

	qualityItem: {},
}));

export default useStyles;
