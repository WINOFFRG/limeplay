import useStyles from './styles';

export function ControlsTopPanel() {
    const { classes } = useStyles();

    return <div className={classes.controlsTopPanel} role={'none'}></div>;
}

export function ControlsMiddlePanel() {
    const { classes } = useStyles();

    return <div className={classes.controlsMiddlePanel} role={'none'}></div>;
}

export function ControlsBottomPanel() {
    const { classes } = useStyles();

    return <div className={classes.controlsBottomPanel} role={'none'}></div>;
}
