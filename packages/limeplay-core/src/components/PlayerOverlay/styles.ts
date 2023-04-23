import { createStyles } from '@mantine/styles';

const useStyles = createStyles((theme) => ({
	overlayWrapper: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 2,
		overflow: 'hidden',
	},
}));

export default useStyles;
