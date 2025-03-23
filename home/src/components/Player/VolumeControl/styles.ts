import {
	createStyles,
	em,
	getBreakpointValue,
	getStylesRef as getRef,
} from '@mantine/styles';

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
			height: '100%',
			width: '100px',
		},

		'&[data-orientation="vertical"]': {
			width: '20px',
			flexDirection: 'column',

			position: 'absolute',
			bottom: '2%',
			left: '35%',
		},

		[`&:hover .${getRef('sliderRange')}`]: {
			backgroundColor: '#1db954',
		},

		[`&:hover .${getRef('sliderThumb')}`]: {
			display: 'block',
		},

		[`&:focus-visible .${getRef('sliderThumb')}`]: {
			display: 'block',
		},

		[`@media (max-width: ${em(getBreakpointValue(theme.breakpoints.sm))})`]:
			{
				display: 'none',
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
		ref: getRef('sliderThumb'),
		display: 'none',
		width: '18px',
		height: '18px',
		backgroundColor: '#fff',
		boxShadow: '0 2px 10px rgba(0, 0, 0, 0.07)',
		borderRadius: '10px',
		cursor: 'pointer',
		color: '#fff',
		transition:
			'display .8s cubic-bezier(0.4,0,0.2,1) ,transform .2s cubic-bezier(0.4,0,0.2,1)',
		...theme.fn.focusStyles(),

		'&[data-disabled]': {
			cursor: 'not-allowed',
		},

		[`@media (max-width: ${em(getBreakpointValue(theme.breakpoints.md))})`]:
			{
				width: '16px',
				height: '16px',
			},
	},
}));

export default useStyles;
