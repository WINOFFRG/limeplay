import { forwardRef } from 'react';
import useStyles from './styles';

const VideoWrapper = forwardRef<HTMLMediaElement>((props, ref) => {
	const { classes } = useStyles();

	return (
		<div className={classes.playerWrapper}>
			<div className={classes.playerNode}>
				<video
					muted
					autoPlay
					controls={false}
					playsInline
					ref={ref as React.RefObject<HTMLVideoElement>}
					className={classes.videoElement}
				/>
			</div>
		</div>
	);
});

export default VideoWrapper;
