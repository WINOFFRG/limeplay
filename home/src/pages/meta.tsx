import Link from 'next/link';
import Image from 'next/image';
import { makeStyles } from '@/styles';
import { useCommonStyles } from '@/styles/common';
import { fadeDown } from '@/styles/animation';
import { Config } from '../../config';

export default function Meta() {
	const { classes, cx } = useStyles();
	const { classes: commonClasses } = useCommonStyles();

	return (
		<div className={classes.heroWrapper}>
			<svg
				className="pointer-events-none fixed isolate z-50 opacity-70 mix-blend-soft-light"
				width="1200px"
				height="630px"
				style={{
					position: 'fixed',
					isolation: 'isolate',
					zIndex: 50,
					opacity: 0.7,
					mixBlendMode: 'soft-light',
				}}
			>
				<filter id="pedroduarteisalegend">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.80"
						numOctaves="4"
						stitchTiles="stitch"
					/>
				</filter>
				<rect
					width="1200px"
					height="630px"
					filter="url(#pedroduarteisalegend)"
				/>
			</svg>
			<Image
				alt="Limeplay"
				src="/meta-grid.webp"
				width={1200}
				height={630}
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					maxWidth: '100%',
					color: 'transparent',
					width: '1200px',
					height: '630px',
				}}
			/>
			<div className={classes.heroIntro}>
				<Link href={Config.GITHUB_URL} tabIndex={-1} target="_blank" />
				<h1
					className={cx(
						classes.heroTitle,
						commonClasses.textSelection
					)}
				>
					{/* &lt;  */}
					Limeplay
					{/* / &gt; */}
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

const useStyles = makeStyles()((theme) => ({
	heroWrapper: {
		overflowX: 'hidden',
		width: '1200px',
		height: '630px',

		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',

		backgroundImage:
			'radial-gradient( circle farthest-corner at 12.3% 19.3%,  #6c78fe 0%, #6561cd 100.2% );',
		// background:
		// 	'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), var(--transparent))',

		[theme.breakpoints.max.tablet]: {
			marginBottom: '-92px',
		},
	},

	heroIntro: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		// margin: '64px',
		// backgroundColor: 'rgba(0, 0, 0, 0.8)',
		borderRadius: '8px',
		padding: '32px',
	},

	releasedPill: {
		animation: `${fadeDown(10)} 1200ms backwards`,
		animationDelay: '0s',
	},

	heroTitle: {
		fontSize: '9rem',
		lineHeight: '1',
		letterSpacing: '-0.02em',
		fontWeight: '500',
		textAlign: 'center',
		// marginTop: '24px',
		// marginBottom: '24px',
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
		fontSize: '2.8rem',
		lineHeight: 1.3,
		fontWeight: 400,
		// margin: '0 0 48px 0',
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
