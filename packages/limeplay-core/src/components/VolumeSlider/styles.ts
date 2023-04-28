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
		outlineOffset: '1.2rem',

		'&[data-orientation="horizontal"]': {
			height: '20px',
			width: '200px',
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

	TooltipContent: {
		borderRadius: '4px',
		padding: '10px 15px',
		fontSize: '15px',
		lineHeight: '1',
		color: '#6F00FF',
		backgroundColor: 'white',
		boxShadow:
			'rgba(54, 54, 54, 0.35) 0px 10px 38px -10px, rgba(54, 54, 54, 0.2) 0px 10px 20px -15px',
		userSelect: 'none',
		animationDuration: '400ms',
		animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
		willChange: 'transform, opacity',
		'&[data-state="delayed-open"][data-side="top"]': {
			animationName: 'slideDownAndFade',
		},
		'&[data-state="delayed-open"][data-side="right"]': {
			animationName: 'slideLeftAndFade',
		},
		'&[data-state="delayed-open"][data-side="bottom"]': {
			animationName: 'slideUpAndFade',
		},
		'&[data-state="delayed-open"][data-side="left"]': {
			animationName: 'slideRightAndFade',
		},
		zIndex: 1000,
	},
	TooltipArrow: {
		fill: 'white',
	},
}));

export default useStyles;
