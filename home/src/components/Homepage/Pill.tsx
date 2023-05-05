import { motion } from 'framer-motion';
import { makeStyles } from '@/styles';

const useStyles = makeStyles()((theme) => ({
	pill: {
		display: 'flex',
		alignItems: 'center',
		height: '28px',
		padding: '0 12px',
		background: 'rgba(255, 255, 255, 0.1)',
		border: '1px solid rgba(255, 255, 255, 0.05)',
		borderRadius: 'var(--rounded-full)',
		backdropFilter: 'blur(12px)',
		fontSize: '13px',
		fontWeight: 500,
		lineHeight: '28px',
		whiteSpace: 'nowrap',
		transition: '260ms',
		transitionProperty: 'background, width',
		color: theme.color.labelBase,

		'& > svg': {
			'&:first-of-type': {
				marginRight: '4px',
			},

			'&:last-child': {
				marginLeft: '4px',
			},
		},

		'& > span': {
			background: 'rgba(255, 255, 255, 0.05)',
			height: '20px',
			padding: '0 8px',
			transition: 'inherit',

			'&:first-of-type': {
				marginLeft: '-8px',
				marginRight: '8px',
			},

			'&:last-child': {
				marginRight: '-8px',
				marginLeft: '8px',
			},

			display: 'flex',
			alignItems: 'center',
			borderRadius: 'var(--rounded-full)',
		},

		'&:hover': {
			cursor: 'pointer',
			background: 'rgba(255, 255, 255, 0.2)',

			'> span': {
				background: 'rgba(255, 255, 255, 0.1)',
			},
		},

		'a &:hover, button &:hover': {
			cursor: 'pointer',
			background: 'rgba(255, 255, 255, 0.2)',

			'> span': {
				background: 'rgba(255, 255, 255, 0.1)',
			},
		},
	},
}));

export function Pill({
	children,
	className = '',
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const { classes, cx } = useStyles();

	return <div className={cx(classes.pill, className)}>{children}</div>;
}
