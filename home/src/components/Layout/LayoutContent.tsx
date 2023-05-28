import { makeStyles } from '@/styles';

const useStyles = makeStyles()({
	wrapper: {
		paddingLeft: 'var(--page-padding-left)',
		paddingRight: 'var(--page-padding-right)',
	},
});

export default function LayoutContent({
	children,
}: {
	children: React.ReactNode;
}) {
	const { classes } = useStyles();

	return <div className={classes.wrapper}>{children}</div>;
}
