import {
	createStyles,
	em,
	getBreakpointValue,
	getStylesRef as getRef,
} from '@mantine/styles';

const useStyles = createStyles((theme) => ({
	skinControls: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		userSelect: 'none',
	},

	controlsWrapper: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		padding: `0 ${theme.spacing.md}`,
		transition:
			'opacity .5s cubic-bezier(0.4,0,0.2,1) ,transform .2s cubic-bezier(0.4,0,0.2,1)',
	},

	controlsTopPanel: {
		height: 'auto',
		width: '100%',
		padding: theme.spacing.xl,
		paddingTop: theme.spacing.md,
		flex: `0 1 auto`,
	},

	topRightSection: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		gap: theme.spacing.xs,
	},

	controlsMiddlePanel: {
		display: 'flex',
		width: '100%',
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},

	controlsBottomPanelWrapper: {
		display: 'flex',
		flexDirection: 'column',

		':before': {
			content: '""',
			position: 'absolute',
			top: '75%',
			left: 0,
			bottom: 0,
			right: 0,
			background:
				'linear-gradient(180deg,rgba(0,0,0,.0001),rgba(0,0,0,.0156863) 8.62%,rgba(0,0,0,.0509804) 16.56%,rgba(0,0,0,.113725) 23.93%,rgba(0,0,0,.188235) 30.85%,rgba(0,0,0,.278431) 37.42%,rgba(0,0,0,.372549) 43.77%,rgba(0,0,0,.47451) 50%,rgba(0,0,0,.576471) 56.23%,rgba(0,0,0,.67451) 62.58%,rgba(0,0,0,.760784) 69.15%,rgba(0,0,0,.839216) 76.07%,rgba(0,0,0,.898039) 83.44%,rgba(0,0,0,.937255) 91.38%,rgba(0,0,0,.94902))',
		},
	},

	controlsBottomPanel: {
		// bottom: 0,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: 'auto',
		width: '100%',
		paddingBottom: theme.spacing.md,
		flex: `0 1 auto`,
		// backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.0001),rgba(0,0,0,.0156863) 8.62%,rgba(0,0,0,.0509804) 16.56%,rgba(0,0,0,.113725) 23.93%,rgba(0,0,0,.188235) 30.85%,rgba(0,0,0,.278431) 37.42%,rgba(0,0,0,.372549) 43.77%,rgba(0,0,0,.47451) 50%,rgba(0,0,0,.576471) 56.23%,rgba(0,0,0,.67451) 62.58%,rgba(0,0,0,.760784) 69.15%,rgba(0,0,0,.839216) 76.07%,rgba(0,0,0,.898039) 83.44%,rgba(0,0,0,.937255) 91.38%,rgba(0,0,0,.94902))`,
		// marginTop: '-400px',
	},

	centrePlaybackIcon: {
		background:
			'radial-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6) 77.5%, transparent 97.5%)',
		borderRadius: '50%',
		padding: '14px',
		margin: '0 auto',
		animation: 'zoom-and-fade-out 500ms ease-out',
		display: 'none',
	},

	iconAnimation: {
		'@keyframes zoom-and-fade-out': {
			'0%': {
				transform: 'scale(0)',
				opacity: 1,
				display: 'block',
			},
			'100%': {
				transform: 'scale(1.5)',
				opacity: 0,
				display: 'none',
			},
		},
	},

	playbackNotification: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		height: '4rem',
		width: '4rem',
		pointerEvents: 'none',
		userSelect: 'none',
		animation: 'buttonFader .5s ease-in-out normal forwards',

		'@keyframes buttonFader': {
			'0%': {
				opacity: 0,
				animationTimingFunction: 'cubic-bezier(0.333, 0, 0.833, 1)',
			},
			'10%': {
				opacity: 1,
				animationTimingFunction: 'cubic-bezier(0.167, 0, 0.833, 1)',
			},
			'40%': {
				opacity: 1,
				animationTimingFunction: 'cubic-bezier(0.167, 0, 0.833, 1)',
			},
			'86.7%': {
				opacity: 0,
			},
			'100%': {
				opacity: 0,
			},
		},
	},

	playbackNotificationBackground: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		borderRadius: '50%',
		background: 'rgba(0,0,0,0.4)',
	},

	playbackNotificationIcon: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '3.8rem',
		width: '3.8rem',
	},

	controlsLeftContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: theme.spacing.xs,
	},

	controlButton: {
		display: 'inline-flex',
		alignItems: 'center',
		width: '44px',
		height: '44px',
		padding: 0,
		opacity: 0.7,
		transition: 'opacity 0.1s ease-in-out',
		backgroundColor: 'transparent',
		border: 'none',
		borderRadius: '4px',
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

		[`@media (max-width: ${em(getBreakpointValue(theme.breakpoints.md))})`]:
			{
				width: '28px',
				height: '28px',
			},
	},

	iconStyle: {
		width: '24px',
		height: '24px',
		margin: 'auto',
		pointerEvents: 'none',
	},

	volumeControl: {
		display: 'inline-flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',

		[`&:hover .${getRef('volumeSlider__Slider')}`]: {
			width: '100px',
			opacity: 1,
		},

		[`&:hover .${getRef('volumeSlider__Progress')}`]: {
			opacity: 1,
		},

		[`&:hover .${getRef('volumeSlider__Head')}`]: {
			opacity: 1,
		},
	},
}));

export default useStyles;
