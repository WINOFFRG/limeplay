import { memo, useRef } from 'react';
import useStore from '../../store';
import useStyles from './styles';
import useTimeline from '../../hooks/useTimeline';

import HoverContainer from './HoverContainer';
import useBufferInfo from '../../hooks/useBufferInfo';

function BufferRangeBar({
	video,
	shakaPlayer,
}: {
	video: HTMLVideoElement;
	shakaPlayer: shaka.Player;
}) {
	const { classes } = useStyles();
	const { bufferInfo } = useBufferInfo(video, shakaPlayer);

	console.log('bufferInfo', bufferInfo);

	return (
		<div
			style={{
				height: '100%',
				width: '100%',
			}}
		>
			{bufferInfo.map((buffer) => (
				<div
					key={`${buffer.start}-${buffer.end}`}
					className={classes.timelineSlider__Buffer}
					style={{
						left: `${buffer.startPosition}%`,
						width: `${buffer.width}%`,
						position: 'absolute',
					}}
				/>
			))}
		</div>
	);
}

const MemoizedBufferRangeBar = memo(BufferRangeBar);

export default function PresentationTimeline() {
	const { classes } = useStyles();
	const elementRef = useRef<HTMLDivElement>(null);
	const { video, shakaPlayer } = useStore((state) => ({
		video: state.video,
		shakaPlayer: state.shakaPlayer,
	}));
	const { bind, progress } = useTimeline(video, shakaPlayer);

	return (
		<div
			className={classes.timelineSlider__Container}
			ref={elementRef}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...bind()}
		>
			<div className={classes.timelineSlider__ProgressBar}>
				<div className={classes.timelineSlider__DurationBar} />
				<div
					className={classes.timelineSlider__DurationPlayed}
					style={{
						width: `${progress}%`,
					}}
				/>
				<MemoizedBufferRangeBar
					video={video}
					shakaPlayer={shakaPlayer}
				/>
			</div>
			<div
				className={classes.timelineSlider__PlayHead}
				style={{
					left: `${progress}%`,
				}}
			/>
			<HoverContainer forwardRef={elementRef} />
		</div>
	);
}
