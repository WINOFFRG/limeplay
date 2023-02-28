import { useRef, useState } from 'react';
import useStore from '../../store';
import useStyles from './styles';
import useTimeline from '../../hooks/useTimeline';
import {
	getChangeValue,
	buildTimeString,
	getClientPosition,
} from './utils/index';

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
		seekRange,
		isSeeking,
		isHour,
	} = useTimeline(video, shakaPlayer);

	const [hoverTime, setHoverTime] = useState<string | null>(null);
	const hoverPos = useRef<number | null>(null);

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
				onPointerMove={(e) => {
					if (!ref.current) return;

					const rect = ref.current.getBoundingClientRect();
					const changePosition = getClientPosition(e.nativeEvent);
					const changeValue = getChangeValue({
						value: changePosition - rect.left,
						max: seekRange.end,
						min: seekRange.start,
						step: 0.01,
						containerWidth: rect.width,
					});

					const hoverTimeText = buildTimeString(
						isLive ? seekRange.end - changeValue : changeValue,
						isHour
					);

					setHoverTime(hoverTimeText);

					hoverPos.current = isLive
						? 100 - ((seekRange.end - changeValue) / duration) * 100
						: (changeValue / duration) * 100;
				}}
				onPointerLeave={() => {
					setHoverTime(null);
				}}
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
				<div
					style={{
						display: hoverTime ? 'block' : 'none',
						left: `${hoverPos.current}%`,
					}}
					className={classes.timelineSlider__VerticalBar__Hover}
				/>
				<div
					style={{
						display: hoverTime ? 'block' : 'none',
						left: `${hoverPos.current}%`,
					}}
					className={
						classes.timelineSlider__VerticalBarDuration__Hover
					}
				>
					{hoverTime}
				</div>
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
				onClick={() => {
					shakaPlayer?.goToLive();
				}}
			>
				<div>{currentTime >= 3 ? 'GO TO LIVE' : 'LIVE'}</div>
			</button>
		</div>
	);
}
