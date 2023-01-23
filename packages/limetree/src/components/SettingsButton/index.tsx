import { useCallback, useEffect, useState } from 'react';
import useStore from '../../store';
import useStyles from './styles';

function SettingsIcon() {
    const { classes } = useStyles();

    return (
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={classes.iconStyle}
        >
            <path
                d="M9.273 0l1.444 2.87a9.209 9.209 0 012.654.025L15.104.113s.872.229 1.693.577c.822.349 1.068.5 1.563.805l-.797 3.176a9.584 9.584 0 011.87 1.89l3.188-.734S23.723 8.097 24 9.34l-2.87 1.442a9.202 9.202 0 01-.026 2.653l2.783 1.732a12.14 12.14 0 01-1.382 3.255l-3.178-.797a9.246 9.246 0 01-1.894 1.859l.743 3.193A12.181 12.181 0 0114.895 24l-1.683-2.81a9.215 9.215 0 01-2.654-.025l-1.733 2.782a12.381 12.381 0 01-1.693-.577 11.82 11.82 0 01-1.564-.804l.798-3.177a9.246 9.246 0 01-1.86-1.893l-3.177.739A12.295 12.295 0 010 14.952l2.8-1.675a9.196 9.196 0 01.025-2.653L.042 8.892a12.14 12.14 0 011.382-3.255l3.178.797a9.261 9.261 0 011.893-1.859l-.742-3.193A12.319 12.319 0 019.273 0zM12 7a5 5 0 100 10 5 5 0 000-10z"
                fill="#FEFEFE"
                fillRule="evenodd"
            />
        </svg>
    );
}

export default function SettingsButton() {
    const { classes } = useStyles();

    return (
        <button className={classes.controlButton}>{<SettingsIcon />}</button>
    );
}
