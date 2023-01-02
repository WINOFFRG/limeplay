import { useCallback, useEffect, useState } from 'react';
import useStore from '../../store';
import useStyles from './styles';

function Forward10() {
    const { classes } = useStyles();

    return (
        <svg
            viewBox="0 0 28 28"
            xmlns="http://www.w3.org/2000/svg"
            className={classes.iconStyle}
        >
            <g fill="none" fillRule="evenodd">
                <path
                    d="M14 8.066V1.934a.5.5 0 01.777-.416l4.599 3.066a.5.5 0 010 .832l-4.599 3.066A.5.5 0 0114 8.066z"
                    fill="#FFF"
                />
                <path
                    d="M25 16c0 6.075-4.925 11-11 11S3 22.075 3 16 7.925 5 14 5"
                    stroke="#FFF"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <text
                    fontFamily="Graphik-Medium, Graphik"
                    fontSize={10}
                    fontWeight={400}
                    fill="#FFF"
                    transform="translate(0 1)"
                >
                    <tspan x="8.4" y={19}>
                        10
                    </tspan>
                </text>
            </g>
        </svg>
    );
}

export default function ForwardButton() {
    const { classes } = useStyles();
    const video = useStore((state) => state.video);
    const shakaPlayer = useStore((state) => state.shakaPlayer);

    useEffect(() => {}, [video]);

    return (
        <button className={classes.controlButton}>
            <Forward10 />
        </button>
    );
}
