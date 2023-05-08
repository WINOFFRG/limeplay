import Link from 'next/link';
import corePackageJson from '@limeplay/core/package.json';
import { makeStyles } from '@/styles';
import { useCommonStyles } from '@/styles/common';
import { Pill } from './Pill';
import { fadeDown } from '@/styles/animation';
import { CTA } from './Button';
import { ChevronRightIcon } from '@/assets/icons/ChevronRightIcon';
import { Player } from './Player';
import { Config } from '../../../config';

export function Hero() {
	const { classes, cx } = useStyles();
	const { classes: commonClasses } = useCommonStyles();

	return (
		<div className={classes.heroWrapper}>
			<div className={commonClasses.layoutContent}>
				<div className={classes.heroIntro}>
					<Link
						href={Config.GITHUB_URL}
						tabIndex={-1}
						target="_blank"
					>
						<Pill className={classes.releasedPill}>
							<span>v{corePackageJson.version}</span>
							<div>
								This Library is under active development
							</div>{' '}
							&nbsp; &rarr;
						</Pill>
					</Link>
					<h1
						className={cx(
							classes.heroTitle,
							commonClasses.textSelection
						)}
					>
						Modern Headless UI Library
						<br /> for Media Player in React
					</h1>
					<h5
						className={cx(
							classes.heroSubtitle,
							commonClasses.textSelection
						)}
					>
						Build modular, accessible, compatible & modern web media
						player at ease
						<br /> Supports Shaka Player and HTML5 Media
					</h5>
				</div>
			</div>
			<CTA>
				<span>Get Started</span>
				<ChevronRightIcon />
			</CTA>
			<Player />
		</div>
	);
}

const useStyles = makeStyles()((theme) => ({
	heroWrapper: {
		overflowX: 'hidden',
		marginTop: 'calc(-1 * var(--header-height))',
		paddingTop: 'var(--header-height)',
		paddingLeft: 'var(--page-padding-left)',
		paddingRight: 'var(--page-padding-right)',
		marginBottom: '-164px',

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
		marginTop: '64px',
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
		fontSize: '1.5rem',
		lineHeight: 1.3,
		fontWeight: 400,
		margin: '0 0 48px 0',
		color: '#B4BCD0',
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
