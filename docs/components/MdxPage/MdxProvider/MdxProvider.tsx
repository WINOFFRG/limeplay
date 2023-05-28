import React from 'react';
import { Code, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { KeyboardEventsTable } from './KeyboardEventsTable/KeyboardEventsTable';
import NextLink from './NextLink/NextLink';
import DataTable from './DataTable/DataTable';
import MdxTitle from './MdxTitle/MdxTitle';
import { Dev, Heading } from '@/pages/dev';
import Test from '@/components/Test';

const h = (order: 1 | 2 | 3 | 4 | 5 | 6) =>
	function (props: any) {
		return <MdxTitle order={order} {...props} />;
	};

export const components = {
	Dev,
	Heading,
	Test,
	NextLink,
	DataTable,
	KeyboardEventsTable,
	h1: h(1),
	h2: h(2),
	h3: h(3),
	h4: h(4),
	h5: h(5),
	h6: h(6),
	code: (props: any) => <Code {...props} />,
	a: ({ href, children }: { href: string; children: string }) => {
		const replaced = href.replace('https://mantine.dev', '');
		const style = { fontSize: 15 };

		if (!replaced.startsWith('http') && replaced.trim().length > 0) {
			return (
				<NextLink
					style={style}
					href={href.replace('https://mantine.dev', '')}
				>
					{children}
				</NextLink>
			);
		}

		return (
			<Text style={style} component="a" variant="link" href={href}>
				{children}
			</Text>
		);
	},
	p: (props: any) => <p {...props} style={{ lineHeight: 1.55 }} />,
	ul: (props: any) => (
		<ul
			{...props}
			style={{ lineHeight: 1.65, marginBottom: 20, marginTop: 10 }}
		/>
	),
	li: (props: any) => <li {...props} style={{ marginTop: 4 }} />,
	pre: (props: any) => {
		const matches = (props.children.props.className || '').match(
			/language-(?<lang>.*)/
		);

		return (
			<Prism
				language={
					matches && matches.groups && matches.groups.lang
						? matches.groups.lang
						: ''
				}
				mb={20}
				trim
			>
				{props.children.props.children}
			</Prism>
		);
	},
};
