import React from 'react';
import { TitleOrder, Title } from '@mantine/core';
import useStyles from './MdxTitle.styles';

export default function MdxTitle({
	id,
	children,
	order,
	...others
}: {
	id: string;
	children: React.ReactNode;
	order: TitleOrder;
}) {
	const { classes } = useStyles();

	if (order === 1) {
		return <Title className={classes.title}>{children}</Title>;
	}

	return (
		<>
			<div id={id} className={classes.offset} />
			<Title
				order={order}
				className={classes.title}
				sx={{ fontWeight: 600 }}
				{...others}
			>
				<a className={classes.link} href={`#${id}`}>
					{children}
				</a>
			</Title>
		</>
	);
}
