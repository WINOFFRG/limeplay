import { useIdle } from '../../hooks/use-idle';
import {
    ControlsBottomPanel,
    ControlsMiddlePanel,
    ControlsTopPanel,
} from './layout';
import useStyles from './styles';

export default function ControlsOverlay() {
    const { classes } = useStyles();

    return (
        <div className={classes.skinControls} role={'none'}>
            <div
                className={classes.controlsWrapper}
                style={
                    {
                        // opacity: idle ? 0 : 1,
                    }
                }
            >
                <ControlsTopPanel />
                <ControlsMiddlePanel />
                <ControlsBottomPanel />
            </div>
        </div>
    );
}
