import { useCallback, useEffect, useState } from 'react';
import useStore from '../../store';
import useStyles from './styles';

function Reverse10() {
    const { classes } = useStyles();

    return (
        <svg
            viewBox="0 0 28 28"
            xmlns="http://www.w3.org/2000/svg"
            className={classes.iconStyle}
        >
            <g fill="none" fillRule="evenodd">
                <path
                    d="M15 8.066V1.934a.5.5 0 00-.777-.416L9.624 4.584a.5.5 0 000 .832l4.599 3.066A.5.5 0 0015 8.066z"
                    fill="#FFF"
                />
                <path
                    d="M4 16c0 6.075 4.925 11 11 11h0c6.075 0 11-4.925 11-11S21.075 5 15 5"
                    stroke="#FFF"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <text
                    fontFamily="Graphik-Medium"
                    fontSize={10}
                    fontWeight={400}
                    fill="#FFF"
                    transform="translate(4 2)"
                >
                    <tspan x="5.4" y={18}>
                        10
                    </tspan>
                </text>
            </g>
        </svg>
    );
}

export default function ReverseButton() {
    const { classes } = useStyles();
    const video = useStore((state) => state.video);
    const shakaPlayer = useStore((state) => state.shakaPlayer);

    useEffect(() => {}, [video]);

    return <button className={classes.controlButton}>{<Reverse10 />}</button>;
}
