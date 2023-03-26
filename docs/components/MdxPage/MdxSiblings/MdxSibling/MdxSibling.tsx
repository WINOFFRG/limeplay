import React from 'react';
import Link from 'next/link';
import { Text } from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons';
import useStyles from './MdxSibling.styles';
import { DocumentTypes } from '@/.contentlayer/generated';

interface MdxSiblingProps {
	data: DocumentTypes;
	type: 'next' | 'prev';
	className?: string;
}

export function MdxSibling({ data, type, className }: MdxSiblingProps) {
	const { classes, cx } = useStyles();

	return (
		<Link href={data.slug} className={cx(classes.control, className)}>
			{type === 'prev' && <IconArrowLeft size={22} stroke={1.5} />}

			<div className={classes.body}>
				<Text size="lg" align={type === 'next' ? 'left' : 'right'}>
					{type === 'next' ? 'Up next' : 'Go back'}
				</Text>
				<Text
					color="dimmed"
					size="sm"
					align={type === 'next' ? 'left' : 'right'}
				>
					{data.title} –{' '}
					{data.package || (data.group && upperFirst(data.group))}
				</Text>
			</div>

			{type === 'next' && <IconArrowRight size={22} stroke={1.5} />}
		</Link>
	);
}
