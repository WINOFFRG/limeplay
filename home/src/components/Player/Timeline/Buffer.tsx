import { useBufferInfo } from '@limeplay/core';
import useStyles from './styles';

export function BufferRangeBar() {
	const { classes } = useStyles();
	const { bufferInfo } = useBufferInfo();

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
