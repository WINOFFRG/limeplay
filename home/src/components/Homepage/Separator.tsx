import { createStyles } from '@mantine/styles';

export function Separator({ children }: { children: React.ReactNode }) {
	const { classes } = useStyles();

	return (
		<div aria-hidden className={classes.starWrapper}>
			{children}
		</div>
	);
}

const useStyles = createStyles((theme) => ({
	starWrapper: {
		'--color': '#b254eb',
		'pointer-events': 'none',
		'user-select': 'none',
		position: 'relative',
		width: 'min(var(--page-max-width), 100%)',
		margin: '0 auto',
		height: '600px',
		overflow: 'hidden',
		// margin: '-128px auto',

		'mask-image':
			'radial-gradient(circle at center, black, transparent 80%)',

		'&::before': {
			content: '""',
			position: 'absolute',
			inset: '0',
			background:
				'radial-gradient(circle at bottom center, #b254eb, transparent 70%)',
			opacity: 0.4,
		},

		'&::after': {
			content: '""',
			position: 'absolute',
			background: 'pageBgValue',
			width: '200%',
			left: '-50%',
			'aspect-ratio': '1 / 0.7',
			'border-radius': '50%',
			'border-top': '1px solid rgba(178, 84, 235, 0.4)',
			top: '50%',
		},
	},
}));
