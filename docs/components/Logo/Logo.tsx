import React from 'react';
import Link from 'next/link';
import useStyles from './Logo.styles';
import { MantineLogo } from '@mantine/ds';

export function Logo(props: MantineLogoProps) {
    const { classes } = useStyles();

    return (
        <Link href="/" className={classes.logo} aria-label="Mantine">
            <MantineLogo size={30} {...props} />
            Limeplay
        </Link>
    );
}
