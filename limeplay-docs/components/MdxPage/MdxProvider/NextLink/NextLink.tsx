import React from 'react';
import Link from 'next/link';
import useStyles from './NextLink.styles';

export default function NextLink(
    props: React.ComponentPropsWithoutRef<typeof Link>
) {
    const { classes } = useStyles();
    return <Link className={classes.link} {...props} />;
}
