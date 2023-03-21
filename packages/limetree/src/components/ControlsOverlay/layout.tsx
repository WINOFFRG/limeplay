import { useRef, useState } from 'react';
import { useMantineTheme } from '@mantine/styles';
import { Code, Group, Text } from '@mantine/core';
import useStore from '../../store';
import PlaybackButton, { PlayIcon } from '../PlaybackButton';
import useStyles from './styles';
import VolumeButton from '../VolumeButton';
// import FullscreenButton from '../FullscreenButton';
// import PipButton from '../PipButton';
// import ReverseButton from '../ReverseButton';
// import ForwardButton from '../ForwardButton';
import SettingsButton from '../SettingsButton';
import PresentationTimeline from '../PresentationTimeline';
// import QualityControl from '../QualityControl';
import { useMove } from '../../utils/useMove';

// export function ControlsTopPanel() {
// 	const { classes } = useStyles();

// 	return (
// 		<div className={classes.controlsTopPanel} role="none">
// 			<div className={classes.topRightSection}>
// 				<QualityControl />
// 				<PipButton />
// 				<FullscreenButton />
// 			</div>
// 		</div>
// 	);
// }

// function Demo() {
// 	const theme = useMantineTheme();
// 	const [value, setValue] = useState({ x: 0.2, y: 0.6 });
// 	const { ref, active } = useMove(setValue);

// 	return (
// 		<>
// 			<Group position="center">
// 				<div
// 					ref={ref}
// 					style={{
// 						left: '50%',
// 						top: '50%',
// 						width: 400,
// 						height: 120,
// 						backgroundColor:
// 							theme.colorScheme === 'dark'
// 								? theme.colors.dark[5]
// 								: theme.colors.gray[1],
// 						position: 'relative',
// 					}}
// 				>
// 					<div
// 						style={{
// 							position: 'absolute',
// 							left: `calc(${value.x * 100}% - 8px)`,
// 							top: `calc(${value.y * 100}% - 8px)`,
// 							width: 16,
// 							height: 16,
// 							backgroundColor: active
// 								? theme.colors.teal[7]
// 								: theme.colors.blue[7],
// 						}}
// 					/>
// 				</div>
// 			</Group>
// 			<Text align="center" style={{ marginTop: theme.spacing.sm }}>
// 				Values{' '}
// 				<Code>{`{ x: ${Math.round(value.x * 100)}, y: ${Math.round(
// 					value.y * 100
// 				)} }`}</Code>
// 			</Text>
// 		</>
// 	);
// }

// export function ControlsMiddlePanel() {
// 	const { classes } = useStyles();
// 	const cuesContainer = useRef<HTMLDivElement>(null);
// 	const video = useStore((state) => state.video);
// 	// const shakaPlayer = useStore((state) => state.shakaPlayer);

// 	// useEffect(() => {
// 	//     if (!cuesContainer.current) return;

// 	//     const textCuesContainer = new shaka.text.UITextDisplayer(
// 	//         video,
// 	//         cuesContainer.current
// 	//     );

// 	//     if (shakaPlayer) {
// 	//         // @ts-ignore
// 	//         window['player'] = shakaPlayer;
// 	//         const textTracks = shakaPlayer.getTextTracks();
// 	//         shakaPlayer.selectTextTrack(textTracks[1]);
// 	//         shakaPlayer.setTextTrackVisibility(true);

// 	//         shakaPlayer.configure(
// 	//             'textDisplayFactory',
// 	//             () =>
// 	//                 new shaka.text.UITextDisplayer(video, cuesContainer.current)
// 	//         );
// 	//     }

// 	//     return () => {
// 	//         if (textCuesContainer) textCuesContainer.destroy();
// 	//     };
// 	// }, [video, shakaPlayer]);

// 	return (
// 		<div
// 			ref={cuesContainer}
// 			className={classes.controlsMiddlePanel}
// 			role="none"
// 			onClick={() => {
// 				if (video) {
// 					if (video.paused) video.play();
// 					else video.pause();
// 				}
// 			}}
// 		>
// 			<div className={classes.centrePlaybackIcon}>
// 				<PlayIcon />
// 			</div>
// 		</div>
// 	);
// }

export function ControlsBottomPanel() {
	const { classes } = useStyles();

	return (
		<div className={classes.controlsBottomPanelWrapper}>
			{/* <PresentationTimeline /> */}
			<div className={classes.controlsBottomPanel} role="none">
				<div>
					<PlaybackButton />
					{/* <ReverseButton />
					<ForwardButton />
					<VolumeButton /> */}
				</div>
				<div>
					<SettingsButton />
					{/* <Demo /> */}
				</div>
			</div>
		</div>
	);
}
