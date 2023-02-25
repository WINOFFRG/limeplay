import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
	heading: {
		color:
			theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
		fontSize: theme.fontSizes.xl,
		fontWeight: 600,
		lineHeight: 1.2,
		margin: 0,
		padding: 0,
		textAlign: 'center',
		textTransform: 'uppercase',
		'@media (max-width: 600px)': {
			fontSize: theme.fontSizes.lg,
		},
	},

	bg: {
		backgroundColor: theme.colors.dark[7],
	},
}));

export default function Home() {
	const { classes } = useStyles();

	return (
		<div>
			<h1 className={classes.heading}>Limeplay Docs</h1>
		</div>
	);
}
