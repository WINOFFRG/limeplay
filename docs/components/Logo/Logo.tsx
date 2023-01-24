import React from 'react';
import Link from 'next/link';
import useStyles from './Logo.styles';

export function Logo(props) {
    const { classes } = useStyles();

    return (
        <Link href="/" className={classes.logo} aria-label="Mantine">
            {/* <MantineLogo size={30} {...props} /> */}
            Limeplay
        </Link>
    );
}
