import { createStyles, getStylesRef as getRef } from '@mantine/styles';

const useStyles = createStyles((theme) => ({
	sliderRoot: {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		flexShrink: 0,
		userSelect: 'none',
		touchAction: 'none',
		WebkitUserSelect: 'none',
		...theme.fn.focusStyles(),
		borderRadius: '0.2rem',

		'&[data-orientation="horizontal"]': {
			height: '40px',
			width: '100px',
		},

		'&[data-orientation="vertical"]': {
			width: '20px',
			height: '200px',
			flexDirection: 'column',

			position: 'absolute',
			bottom: '2%',
			left: '35%',
		},

		[`&:hover .${getRef('sliderRange')}`]: {
			backgroundColor: '#1db954',
		},
	},

	sliderTrack: {
		backgroundColor: '#5e5e5e',
		position: 'relative',
		flexGrow: 1,
		borderRadius: '2px',

		'&[data-orientation="horizontal"]': {
			width: '100%',
			height: '4px',
		},

		'&[data-orientation="vertical"]': {
			width: '4px',
			height: '100%',
		},
	},

	sliderRange: {
		ref: getRef('sliderRange'),
		position: 'absolute',
		backgroundColor: 'white',
		borderRadius: '2px',

		'&[data-orientation="horizontal"]': {
			height: '100%',
		},

		'&[data-orientation="vertical"]': {
			width: '100%',
			bottom: 0,
		},
	},

	sliderThumb: {
		display: 'block',
		width: '20px',
		height: '20px',
		backgroundColor: '#fff',
		boxShadow: '0 2px 10px rgba(0, 0, 0, 0.07)',
		borderRadius: '10px',
		cursor: 'pointer',
		// opacity: 0.5,
		color: '#fff',

		'&[data-disabled]': {
			cursor: 'not-allowed',
		},
	},
}));

export default useStyles;