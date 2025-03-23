import { createStyles } from '@mantine/styles';

const useStyles = createStyles((theme) => ({
	overlayWrapper: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		overflow: 'hidden',
		zIndex: 5,
	},

	cuesConatiner: {
		position: 'absolute',
		left: 0,
		width: '100%',
		height: '100%',
		minWidth: 48,
		textAlign: 'center',
		overflow: 'hidden',
		bottom: 0,
		margin: 'auto',
		zIndex: 2,
	},
}));

export default useStyles;
