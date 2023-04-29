import { createStyles, keyframes } from '@mantine/styles';

const zoomOut = keyframes({
	'0%': {
		opacity: 0.8,
		transform: 'scale(0.8)',
	},
	'100%': {
		opacity: 1,
		transform: 'scale(1)',
	},
});

const useStyles = createStyles((theme) => ({
	playerWrapper: {
		display: 'block',
		position: 'relative',
		width: '100%',
		height: '100%',
		overflow: 'hidden',
	},

	playerNode: {
		width: '100%',
		height: '100%',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundColor: theme.black,
	},

	videoElement: {
		// opacity: 0.1,
		display: 'block',
		width: '100%',
		height: '100%',
		objectFit: 'contain',
		position: 'absolute',
		top: 0,
		left: 0,
	},
}));

export default useStyles;
