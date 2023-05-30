import { createStyles, em, getBreakpointValue } from '@mantine/styles';

const useStyles = createStyles((theme) => ({
	iconStyle: {
		width: '24px',
		height: '24px',
		margin: '0 auto',
		pointerEvents: 'none',

		[theme.fn.smallerThan('md')]: {
			width: '18px',
			height: '18px',
		},
	},
}));

export default useStyles;
