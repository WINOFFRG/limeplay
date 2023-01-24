import React from 'react';
import Link from 'next/link';
import { Text } from '@mantine/core';
import useStyles from './LinksGroup.styles';

export interface LinksGroupProps {
    title: string;
    data: {
        type: 'link' | 'next';
        link: string;
        label: string;
    }[];
}

export function LinksGroup({ data, title }: LinksGroupProps) {
    const { classes } = useStyles();
    const links = data.map((link, index) => {
        const props =
            link.type === 'next' ? { to: link.link } : { href: link.link };
        return (
            <Text<any>
                className={classes.link}
                component={link.type === 'next' ? Link : 'a'}
                {...props}
                key={index}
                href={link.link}
            >
                {link.label}
            </Text>
        );
    });

    return (
        <div className={classes.wrapper}>
            <Text className={classes.title}>{title}</Text>
            {links}
        </div>
    );
}
