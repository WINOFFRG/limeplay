import useStore from '../../store';
import useStyles from './styles';
import useTimeline from '../../hooks/useTimeline';
import { buildTimeString } from './utils/index';

import HoverContainer from './HoverContainer';

export default function PresentationTimeline() {
	const { classes } = useStyles();
	const video = useStore((state) => state.video);
	const shakaPlayer = useStore((state) => state.shakaPlayer);

	const {
		ref,
		progress,
		currentTime,
		duration,
		isLive,
		liveLatency,
		isHour,
		// @ts-ignore
	} = useTimeline(video, shakaPlayer);

	return (
		<div className={classes.timelineWrrapper}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '2px',
				}}
			>
				<span>{buildTimeString(currentTime, isHour)}</span>
			</div>
			<div
				className={classes.timelineSlider__Continer}
				ref={ref as React.LegacyRef<HTMLDivElement>}
			>
				<div className={classes.timelineSlider__ProgressBar}>
					<div className={classes.timelineSlider__DurationBar} />
					<div
						className={classes.timelineSlider__DurationPlayed}
						style={{
							width: `${progress}%`,
							borderRadius: '12px',
						}}
					/>
				</div>
				<div
					className={classes.timelineSlider__PlayHead}
					style={{
						left: `${progress}%`,
					}}
				/>
				{shakaPlayer && video && (
					<HoverContainer
						player={shakaPlayer}
						playback={video}
						forwardRef={ref}
					/>
				)}
			</div>

			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '2px',
				}}
			>
				<span>{shakaPlayer?.isLive() ? '-' : ''}</span>
				<span>
					{buildTimeString(isLive ? liveLatency : duration, isHour)}
				</span>
			</div>
			<button
				className={classes.controlButton}
				type="button"
				style={{
					display: shakaPlayer?.isLive() ? 'flex' : 'none',
					backgroundColor: shakaPlayer?.isLive() ? 'red' : 'gray',
					color: 'white',
					padding: '5px 10px',
					borderRadius: '5px',
					border: 'none',
					fontSize: '12px',
					height: 'max-content',
					fontWeight: '700',
					outline: 'none',
					cursor: 'pointer',
					width: 'max-content',
					whiteSpace: 'nowrap',
					alignItems: 'center',
					justifyContent: 'center',
				}}
				// onClick={() => {
				// 	shakaPlayer?.goToLive();
				// }}
			>
				<div>{currentTime >= 3 ? 'GO TO LIVE' : 'LIVE'}</div>
			</button>
		</div>
	);
}
