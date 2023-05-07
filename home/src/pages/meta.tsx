import Link from 'next/link';
import { makeStyles } from '@/styles';
import { useCommonStyles } from '@/styles/common';
import { fadeDown } from '@/styles/animation';
import { Config } from '../../config';

export default function Meta() {
	const { classes, cx } = useStyles();
	const { classes: commonClasses } = useCommonStyles();

	return (
		<div className={classes.heroWrapper}>
			<div className={classes.heroIntro}>
				<Link href={Config.GITHUB_URL} tabIndex={-1} target="_blank" />
				<h1
					className={cx(
						classes.heroTitle,
						commonClasses.textSelection
					)}
				>
					{/* ?less than sign */}
					&lt; Limeplay / &gt;
				</h1>
				<h5
					className={cx(
						classes.heroSubtitle,
						commonClasses.textSelection
					)}
				>
					Modern Headless UI Library for Media Player in React
				</h5>
			</div>
		</div>
	);
}

// radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), #6c79ff)

const useStyles = makeStyles()((theme) => ({
	heroWrapper: {
		overflowX: 'hidden',
		paddingTop: 'var(--header-height)',
		paddingLeft: 'var(--page-padding-left)',
		paddingRight: 'var(--page-padding-right)',
		// marginBottom: '-164px',

		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',

		background:
			'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), var(--transparent))',

		[theme.breakpoints.max.tablet]: {
			marginBottom: '-92px',
		},
	},

	heroIntro: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		margin: '64px',
		// backgroundColor: 'rgba(0, 0, 0, 0.8)',
		borderRadius: '8px',
		padding: '32px',
	},

	releasedPill: {
		animation: `${fadeDown(10)} 1200ms backwards`,
		animationDelay: '0s',
	},

	heroTitle: {
		fontSize: '5rem',
		lineHeight: '1',
		letterSpacing: '-0.02em',
		fontWeight: '500',
		textAlign: 'center',
		marginTop: '24px',
		marginBottom: '24px',
		background:
			'linear-gradient(to bottom right, #FFFFFF 30%, rgba(255, 255, 255, 0.38))',
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

	heroSubtitle: {
		fontSize: '1.8rem',
		lineHeight: 1.3,
		fontWeight: 400,
		margin: '0 0 48px 0',
		// color: '#B4BCD0',
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
