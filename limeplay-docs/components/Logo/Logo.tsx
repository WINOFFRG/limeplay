import React from 'react';
import Link from 'next/link';
import { MantineLogo, MantineLogoProps } from '@mantine/ds';
import useStyles from './Logo.styles';

export function Logo(props: MantineLogoProps) {
    const { classes } = useStyles();

    return (
        <Link href="/" className={classes.logo} aria-label="Mantine">
            <MantineLogo size={30} {...props} />
        </Link>
    );
}
