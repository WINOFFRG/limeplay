import Link from 'next/link';
import corePackageJson from '@limeplay/core/package.json';
import { Text, Title, createStyles, em } from '@mantine/core';
import { useCommonStyles } from '@/styles/common';
import { Pill } from './Pill';
import { fadeDown } from '@/styles/animation';
import { CTA } from './Button';
import { ChevronRightIcon } from '@/assets/icons/ChevronRightIcon';
import { Player } from './Player';
import { Config } from '../../../config';
import LayoutContent from '../Layout/LayoutContent';

export function Hero() {
	const { classes, cx } = useStyles();

	return (
		<div className={classes.heroWrapper}>
			<div className={classes.heroIntro}>
				<Link href={Config.GITHUB_URL} tabIndex={-1} target="_blank">
					<Pill className={classes.releasedPill}>
						<span>v{corePackageJson.version}</span>
						<Text size="sm">
							This Library is under active development
						</Text>{' '}
						&nbsp; &rarr;
					</Pill>
				</Link>
				<Title order={1} className={cx(classes.heroTitle)}>
					Modern Headless UI Library
					<br /> for Media Player in React
				</Title>
				<Title order={5} className={cx(classes.heroSubtitle)}>
					Build modular, accessible, compatible & modern web media
					player at ease
					<br /> Supports Shaka Player and HTML5 Media
				</Title>
			</div>
			<CTA>
				<span>Get Started</span>
				<ChevronRightIcon />
			</CTA>
			<Player />
		</div>
	);
}

const useStyles = createStyles((theme) => ({
	heroWrapper: {
		marginTop: 'calc(-1 * var(--header-height))',
		paddingTop: 'var(--header-height)',
		paddingLeft: 'var(--page-padding-left)',
		paddingRight: 'var(--page-padding-right)',

		// To merge flow of hero and player
		paddingBottom: em(16),

		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',

		background:
			'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent)',

		// [theme.breakpoints.max.tablet]: {
		// 	marginBottom: '-92px',
		// },
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
		fontSize: em(80),
		lineHeight: '1',
		letterSpacing: '-0.02em',
		fontWeight: 500,
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

		[theme.fn.smallerThan('lg')]: {
			fontSize: em(64),
			letterSpacing: '-0.01em',

			'& br': {
				display: 'none',
			},
		},

		[theme.fn.smallerThan('md')]: {
			fontSize: em(48),
			letterSpacing: '-0.01em',

			'& br': {
				display: 'none',
			},
		},
	},

	heroSubtitle: {
		fontSize: em(24),
		lineHeight: 1.3,
		fontWeight: 400,
		margin: '0 0 48px 0',
		color: '#B4BCD0',
		textAlign: 'center',
		animation: `${fadeDown(10)} 1200ms backwards`,
		animationDelay: '400ms',

		[theme.fn.smallerThan('md')]: {
			letterSpacing: '0.02em',
			fontSize: em(18),

			'& br': {
				display: 'none',
			},
		},
	},
}));
