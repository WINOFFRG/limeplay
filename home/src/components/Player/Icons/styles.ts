import { createStyles, em, getBreakpointValue } from '@mantine/styles';

const useStyles = createStyles((theme) => ({
	iconStyle: {
		width: '28px',
		height: '28px',
		margin: 0,
		pointerEvents: 'none',

		[theme.fn.smallerThan('md')]: {
			width: '18px',
			height: '18px',
		},
	},
}));

export default useStyles;
