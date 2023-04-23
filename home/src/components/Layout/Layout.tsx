import { makeStyles } from '@/styles';
import { Header } from './Header';
import { Footer } from './Footer';

export type LayoutProps = {
	children?: React.ReactNode;
	/** Header rendered above the content. */
	header?: React.ReactNode | null;
	/** Footer rendered below the content. */
	footer?: React.ReactNode | null;
	/** Class applied to page wrapper element. */
	className?: string;
};

const useStyles = makeStyles()({
	container: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		lineHeight: '1.53em',
	},

	content: {
		minHeight: '100vh',

		'header ~ &': {
			paddingTop: 'var(--header-height)',
		},
	},
});

export function Layout({
	children = null,
	header = <Header />,
	footer = <Footer />,
	...others
}: LayoutProps) {
	const { classes } = useStyles();

	return (
		<div {...others} className={classes.container}>
			{header}
			<main className={classes.content}>{children}</main>
			{footer}
		</div>
	);
}
