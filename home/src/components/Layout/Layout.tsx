import { createStyles, em } from '@mantine/styles';
import { Flex } from '@mantine/core';
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

const useStyles = createStyles({
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
		<Flex direction="column" w="100%" {...others}>
			{header}
			<main className={classes.content}>{children}</main>
			{footer}
		</Flex>
	);
}
