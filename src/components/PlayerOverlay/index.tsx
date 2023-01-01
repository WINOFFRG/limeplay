import useStyles from './styles';

const PlayerOverlay: React.FC = () => {
    const { classes } = useStyles();

    return <div className={classes.overlayWrapper}></div>;
};

export default PlayerOverlay;
