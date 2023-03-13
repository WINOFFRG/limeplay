import { useCallback, useEffect, useRef, useState } from 'react';
import { useGesture } from '@use-gesture/react';
import clamp from 'lodash/clamp';
import useStore from '../../store';
import useStyles from './styles';
import useTimeline from '../../hooks/useTimeline';
import { buildTimeString } from './utils/index';

import HoverContainer from './HoverContainer';

export default function PresentationTimeline() {
	const { classes } = useStyles();
	const video = useStore((state) => state.video);
	const shakaPlayer = useStore((state) => state.shakaPlayer);
	const [progress, setProgress] = useState(50);
	const elementRef = useRef<HTMLDivElement>(null);
	const playHead = useRef<HTMLDivElement>(null);

	const cbFunction = useCallback(({ event }) => {
		const rect = event.currentTarget.getBoundingClientRect();

		console.log('Callback Function');

		const newValue = ((event.clientX - rect.left) / rect.width) * 100;

		const clammpedValue = clamp(newValue, 0, 100);

		setProgress(clammpedValue);
	}, []);

	const callbackRef = useRef(cbFunction);

	useEffect(() => {
		if (callbackRef.current === cbFunction) {
			console.log('The same memoized function is being used');
		} else {
			console.log('A new function is being created');
			callbackRef.current = cbFunction;
		}
	});

	const bind = useGesture(
		{
			onDrag: cbFunction,
			onMouseDown: cbFunction,
		},
		{
			drag: {
				axis: 'x',
				filterTaps: false,
			},
		}
	);

	console.log('Component Rendered');

	return (
		<div className={classes.timelineWrrapper}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '2px',
				}}
			/>
			<div
				className={classes.timelineSlider__Continer}
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
							borderRadius: '12px',
						}}
					/>
				</div>
				<div
					className={classes.timelineSlider__PlayHead}
					style={{
						left: `${progress}%`,
					}}
					tabIndex={0}
					ref={playHead}
				/>
				{shakaPlayer && video && (
					<HoverContainer
						player={shakaPlayer}
						playback={video}
						forwardRef={elementRef}
					/>
				)}
			</div>
		</div>
	);
}
