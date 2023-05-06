import Link from 'next/link';
import { makeStyles } from '@/styles';
import { fadeDown } from '@/styles/animation';

const useStyles = makeStyles()((theme) => ({
	heroButton: {
		appearance: 'none',
		cursor: 'pointer',
		position: 'relative',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '8px',
		animation: `${fadeDown(10)} 1200ms backwards`,
		animationDelay: '800ms',

		whiteSpace: 'nowrap',
		userSelect: 'none',
		maxWidth: '100%',
		flexShrink: '0',

		margin: '0',
		background: 'none',
		border: 'none',
		color: theme.color.labelBase,
		font: 'inherit',

		'& > svg': {
			willChange: 'transform',
			fill: 'currentColor',
		},

		'&:disabled': {
			cursor: 'not-allowed',
		},

		fontSize: '18px',
		fontWeight: 500,
		height: '48px',
		borderRadius: '5px',
		padding: '0 24px',
		transition: '120ms',
		transitionProperty:
			'border, background-color, color, box-shadow, opacity',

		[theme.breakpoints.max.tablet]: {
			fontSize: '16px',
			height: '40px',
			// borderRadius: 'var(--rounded-full)',
			padding: '0 24px',
		},
	},

	primary: {
		border: 'none',
		background:
			'linear-gradient(92.88deg, #455eb5 9.16%, #5643cc 43.89%, #673fd7 64.72%)',
		textShadow: '0px 3px 8px rgba(0, 0, 0, 0.25)',

		'&:hover': {
			color: 'white',
			textShadow: '0 3px 12px rgba(0, 0, 0, 0.56)',
			boxShadow: '0px 1px 40px rgba(80, 63, 205, 0.5)',
		},
	},

	dimmed: {
		border: '1px solid rgba(255, 255, 255, 0.2)',
		background: 'rgba(255, 255, 255, 0.1)',
		color: 'rgba(255, 255, 255, 0.5)',
		textShadow: 'none',

		'&:hover': {
			color: 'inherit',
			textShadow: 'none',
			boxShadow: '0px 1px 40px rgba(80, 63, 205, 0.5)',
		},
	},
}));

export function CTA({ children }: { children: React.ReactNode }) {
	const { classes, cx } = useStyles();

	return (
		<Link href="https://docs.limeplay.me" target="_blank" tabIndex={-1}>
			<button
				type="button"
				className={cx(classes.heroButton, classes.primary)}
			>
				{children}
			</button>
		</Link>
	);
}

export function DimmedButton({ children }: { children: React.ReactNode }) {
	const { classes, cx } = useStyles();

	return (
		<button
			type="button"
			className={cx(classes.heroButton, classes.dimmed)}
		>
			{children}
		</button>
	);
}
