import { createStyles, getStylesRef as getRef } from '@mantine/styles';

const useStyles = createStyles((theme, _params) => ({
	timelineWrrapper: {
		display: 'flex',
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: theme.spacing.sm,
		userSelect: 'none',
		boxSizing: 'border-box',
		position: 'relative',
	},

	timelineSlider__Container: {
		height: '36px',
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		alignSelf: 'stretch',
		position: 'relative',
		touchAction: 'none',
		userSelect: 'none',

		[`&:hover .${getRef('timelineSlider__ProgressBar')}`]: {
			height: '6px',
		},

		[`&:hover .${getRef('timelineSlider__Buffer')}`]: {
			height: '6px',
		},

		[`&:hover .${getRef('timelineSlider__DurationBar')}`]: {
			height: '6px',
		},

		[`&:hover .${getRef('timelineSlider__PlayHead')}`]: {
			transform: 'scale(1.25)',
			// transformOrigin: '50% 50%',
		},

		[`&:focus .${getRef('timelineSlider__PlayHead')}`]: {
			transform: 'scale(1.25)',
			// transformOrigin: '50% 50%',
		},
	},

	timelineSlider__ProgressBar: {
		ref: getRef('timelineSlider__ProgressBar'),
		position: 'relative',
		height: '4px',
		width: '100%',
		// borderRadius: '2px',
		transition: 'height border-radius 0.2s ease-in-out',
		flex: '1 1 auto',
		backgroundColor: '#808080',

		'&:before': {
			content: '""',
			position: 'absolute',
			top: 0,
			height: '100%',
			width: '4px',
			// zIndex: 1,
			borderRadius: '2px 0 0 2px',
			left: '-4px',
			backgroundColor: theme.colors.blue[8],
		},

		'&:after': {
			content: '""',
			position: 'absolute',
			top: 0,
			height: '100%',
			width: '4px',
			// zIndex: 1,
			borderRadius: '0 2px 2px 0',
			right: '-4px',
			backgroundColor: '#808080',
		},
	},

	timelineSlider__DurationBar: {
		ref: getRef('timelineSlider__DurationBar'),
		// position: 'absolute',
		// height: '100%',
		// width: '100%',
		// backgroundColor: '#808080',
		// // borderRadius: '2px',
		// transition: 'transform 0.2s ease-in-out',

		position: 'absolute',
		backgroundColor: '#1db954',
		borderRadius: '2px',

		'&[data-orientation="horizontal"]': {
			height: '100%',
		},

		'&[data-orientation="vertical"]': {
			width: '100%',
			bottom: 0,
		},
	},

	timelineSlider__DurationPlayed: {
		ref: getRef('timelineSlider__DurationPlayed'),
		position: 'absolute',
		height: '100%',
		backgroundColor: theme.colors.blue[8],
		transition: 'transform 0.2s ease-in-out',
		zIndex: 1,
	},

	timelineSlider__Buffer: {
		ref: getRef('timelineSlider__Buffer'),
		position: 'relative',
		height: '100%',
		borderRadius: '2px',
		backgroundColor: theme.colors.red[5],
		zIndex: 2,
		transition: 'width 0.2s ease-in-out',
	},

	timelineSlider__PlayHead: {
		ref: getRef('timelineSlider__PlayHead'),

		display: 'block',
		width: '20px',
		height: '20px',
		backgroundColor: '#fff',
		boxShadow: '0 2px 10px rgba(0, 0, 0, 0.07)',
		borderRadius: '10px',
		cursor: 'pointer',
		// opacity: 0.5,
		color: '#fff',
		transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)',
		...theme.fn.focusStyles(),

		'&[data-disabled]': {
			cursor: 'not-allowed',
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

	timelineSlider__VerticalBar__Hover: {
		position: 'absolute',
		height: '16px',
		width: '4px',
		backgroundColor: theme.white,
		borderRadius: '2px',
		transform: 'translate(-50%)',
		zIndex: 2,
		// transition: 'all 0.2s ease-in-out',
	},

	timelineSlider__VerticalBarDuration__Hover: {
		position: 'absolute',
		// height: '16px',
		// width: '4px',
		padding: '0 8px',
		backgroundColor: theme.colors.dark[7],
		color: theme.white,
		borderRadius: '2px',
		transform: 'translateX(-50%) translateY(-120%)',
	},
}));

export default useStyles;
