import { keyframes } from 'tss-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { makeStyles } from '@/styles';
import { PlayerControls } from './Controls';
import { LimeplayPlayer } from './Limeplay';
import { Stars } from './Stars';

export function Player() {
	const ref = useRef(null);
	const inView = useInView(ref, { amount: 0.6, once: true });
	const { classes, cx } = useStyles({
		visible: inView,
	});

	return (
		<section className={classes.playerWrapper}>
			<div
				aria-hidden="true"
				className={cx(classes.asset, ...(inView ? ['visible'] : []))}
				ref={ref}
			>
				<div className={classes.backgroundColor} />
				<Stars parentRef={ref} />
				<svg className={classes.svg}>
					<path pathLength={1} d="M1500 72L220 72" />
					<path pathLength={1} d="M1500 128L220 128" />
					<path pathLength={1} d="M1500 189L220 189" />
					<path pathLength={1} d="M220 777L220 1" />
					<path pathLength={1} d="M538 777L538 128" />
				</svg>
				<LimeplayPlayer parentRef={ref} />
			</div>
			<PlayerControls />
		</section>
	);
}

const useStyles = makeStyles<{ visible: boolean }>()((theme, { visible }) => ({
	playerWrapper: {
		':root': {
			'--base-delay': '0s',
		},
		width: 'min(var(--page-max-width), 100%)',
		perspective: '2000px',
		paddingBottom: '420px',

		[theme.breakpoints.max.tablet]: {
			paddingBottom: '256px',
		},
	},

	asset: {
		':root': {
			'--radius': '8px',
		},
		width: '100%',
		height: '100%',
		display: 'grid',
		gridTemplateColumns: '1fr',
		gridTemplateRows: '1fr',
		transition: 'transform 400ms ease-out',
		marginTop: '128px',
		transform: 'rotateX(25deg)',
		// pointerEvents: 'none',
		// userSelect: 'none',

		...(visible && {
			animation: `${pressAndPop} 1400ms forwards`,
			animationDelay: 'calc(var(--base-delay) + 400ms)',
		}),

		'& > *': {
			gridRow: '1 / 1',
			gridColumn: '1 / 1',
		},

		'@media (max-width: 768px)': {
			':root': {
				'--radius': '2px',
			},
			marginTop: '72px',
		},
	},

	backgroundColor: {
		opacity: 0,
		background:
			'conic-gradient(from 230.29deg at 51.63% 52.16%, #2400ff 0deg, #0087ff 67.5deg, #6c279d 198.75deg, #1826a3 251.25deg, #3667c4 301.88deg, #691eff 360deg)',
		filter: 'blur(160px)',
		transform: 'translateZ(0)',

		...(visible && {
			animation: `${colorFlash} 4.1s ease-out forwards`,
			animationDelay: 'calc(var(--base-delay) + 600ms)',
		}),
	},

	svg: {
		':root': {
			'--duration': '1200ms',
		},

		'& path': {
			strokeDasharray: '1',
			strokeDashoffset: '1',
			stroke: 'white',
			strokeOpacity: 0.2,
			...(visible && {
				animation: `${draw} var(--duration) ease-out forwards`,
				animationDelay: 'var(--base-delay)',
			}),
		},
	},
}));

const pressAndPop = keyframes`
  0% {
    transform: rotateX(25deg);
  }

  25% {
    transform: rotateX(25deg) scale(0.9);
  }

  60%, to {
    transform: none;
  }
`;

const colorFlash = keyframes`
  0% {
    opacity: 0;
    animation-timing-function: cubic-bezier(0.74, 0.25, 0.76, 1);
  }

  10% {
    opacity: 1;
    animation-timing-function: cubic-bezier(0.12, 0.01, 0.08, 0.99);
  }

  100% {
    opacity: 0.2;
  }
`;

const draw = keyframes`
  from {
    stroke-dashoffset: 1;
  }

  50% {
    stroke-dashoffset: 0;
  }

  99% {
    stroke-dashoffset: 0;
  }

  100% {
    visibility: hidden;
  }
`;
