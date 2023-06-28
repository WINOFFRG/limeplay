import { useBufferInfo } from '@limeplay/core';
import * as Slider from '@radix-ui/react-slider';
import useStyles from './styles';

export function BufferRangeBar({
	player,
	playback,
}: {
	player: shaka.Player;
	playback: HTMLMediaElement;
}) {
	const { classes } = useStyles();
	const { bufferInfo } = useBufferInfo({
		playback,
		player,
	});

	console.log(bufferInfo[0]);

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
