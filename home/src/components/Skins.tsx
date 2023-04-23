import { makeStyles } from '@/styles';
import { Separator } from './Separator';
import { fadeDown } from '@/styles/animation';

export function PlayerSkins() {
	const { classes } = useStyles({
		background: `conic-gradient(from 45deg, #B9090B, #B9090B 60%, #221F1F 60%, #221F1F)`,
	});

	return (
		<div>
			<Separator kind="fading" />
			<div className={classes.wrapper}>
				<div className={classes.containerBackground} />
				<div className={classes.callout}>
					<div className={classes.title}>Player Skins</div>
					<p className={classes.subtitle}>
						We have a variety of skins for you to choose from. You
						can also create
					</p>
				</div>
			</div>
		</div>
	);
}

const useStyles = makeStyles<{
	background?: string;
}>()((theme, { background }) => ({
	wrapper: {
		// temp
		height: '100vh',

		position: 'relative',
		padding: '64px 0',
		'--layer-pane-image': '2',
		'--layer-pane-overlay-bg': '3',
		'--layer-pane-overlay': '4',
		'--layer-pane-shine': '5',
	},

	containerBackground: {
		pointerEvents: 'none',
		position: 'absolute',
		top: '0',
		left: '0',
		right: '0',
		bottom: '0',
		overflow: 'hidden',
		'&::before': {
			willChange: 'transform',
			content: '""',
			position: 'absolute',
			top: '0',
			left: '50%',
			height: '100%',
			width: '100%',
			transform: 'translateX(-50%)',
			opacity: '0.3',
			filter: 'blur(60px)',
			background:
				background ??
				`conic-gradient(
			  from 180deg at 58.33% 50%,
			  #6d54e1 0deg,
			  #ac8eff 7.5deg,
			  #b59aff 125.63deg,
			  #1ac8fc 243.75deg,
			  #6d54e1 360deg
			)`,
		},
		'&::after': {
			content: '""',
			position: 'absolute',
			left: '0',
			right: '0',
			bottom: '0',
			top: '60%',
			background: `linear-gradient(to top, ${theme.color.pageBg}, transparent)`,
		},
	},

	callout: {
		width: '100%',
		maxWidth: '1008px',
		margin: '0 auto',
		padding: '0 24px',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		gap: '4px',
	},

	title: {
		fontSize: '3rem',
		lineHeight: '1',
		letterSpacing: '-0.02em',
		fontWeight: '500',
		textAlign: 'center',
		marginTop: '24px',
		background:
			'linear-gradient(92.88deg, rgb(69, 94, 181) 9.16%, rgb(86, 67, 204) 43.89%, rgb(103, 63, 215) 64.72%)',
		boxDecorationBreak: 'clone',
		backgroundClip: 'text',
		textFillColor: 'transparent',
		color: 'unset',
		animation: `${fadeDown(10)} 1000ms backwards`,

		'&::after': {
			content: '""',
			font: 'inherit',
			display: 'block',
			paddingBottom: '0.33em',
			marginBottom: '-0.13em',
		},

		[theme.breakpoints.max.mobile]: {
			fontSize: '2.2rem',
			letterSpacing: '-0.01em',

			'& br': {
				display: 'none',
			},
		},
	},

	subtitle: {
		fontSize: '1.2rem',
		lineHeight: 1.3,
		fontWeight: 400,
		margin: '0 0 48px 0',
		color: theme.color.labelBase,
		textAlign: 'center',
		animation: `${fadeDown(10)} 1200ms backwards`,
		animationDelay: '400ms',

		[theme.breakpoints.max.mobile]: {
			letterSpacing: '0.02em',
			fontSize: '1rem',

			'& br': {
				display: 'none',
			},
		},
	},
}));
