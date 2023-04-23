import { useLimeplayStore } from '../../store';
import {
	ControlsBottomPanel,
	ControlsMiddlePanel,
	ControlsTopPanel,
} from './layout';
import useStyles from './styles';

export default function ControlsOverlay() {
	const { classes } = useStyles();

	return (
		<div className={classes.skinControls}>
			<div className={classes.controlsWrapper}>
				<ControlsTopPanel />
				<ControlsMiddlePanel />
				<ControlsBottomPanel />
			</div>
		</div>
	);
}
