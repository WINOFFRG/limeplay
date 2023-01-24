import React from 'react';
import Link from 'next/link';
import useStyles from './Logo.styles';
import Image from 'next/image';
import { Text } from '@mantine/core';

export function Logo() {
    const { classes } = useStyles();

    return (
        <Link href="/" className={classes.logo} aria-label="Mantine">
            <Text
                style={{
                    fontSize: '1.2rem',
                    paddingBottom: '0.4rem',
                    fontWeight: 500,
                }}
            >
                Limeplay
            </Text>
        </Link>
    );
}
