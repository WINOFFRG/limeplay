import { useAudioTracks, useTextTracks } from '@limeplay/core';
import { Box, Flex, Menu, Text, createStyles } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { SubtitleIcons, VideoQuality } from '../Icons/Icons';
import { IconButton } from '@/components/common/Buttons';

const useStyles = createStyles((theme) => ({
	backgroundStyle: {},
	dropDown: {},
}));

function SelectIcon({ shown }: { shown: boolean }) {
	return shown ? (
		<IconCheck color="#1db954" size={18} />
	) : (
		<Box w={18} h={18} />
	);
}

export function AudioMenu() {
	const { selectedTrack, tracks, selectTrack } = useAudioTracks();
	const subtitleRef = useRef(document.getElementById('shaka-text-container'));
	const [container, setContainer] = useState(null);

	const {
		selectedTrack: selectedSubtitleTracks,
		tracks: subtitleTracks,
		selectTrack: selectSubtitleTrack,
		isVisible,
		toggleVisibility,
	} = useTextTracks({
		ref: subtitleRef,
	});

	const { classes, cx } = useStyles();

	return (
		<Menu
			shadow="md"
			opened
			// width={160}
			trigger="hover"
			offset={60}
			withArrow
			transitionProps={{ transition: 'fade', duration: 100 }}
			closeDelay={200}
			styles={{
				dropdown: {
					background: 'rgba(0,0,0,0.64)',
					backdropFilter: 'blur(10px)',
					marginLeft: -24,
				},
				arrow: {
					background: 'rgba(0,0,0,0.64)',
					backdropFilter: 'blur(10px)',
				},
			}}
		>
			<Menu.Target>
				<IconButton aria-label="Select Audio">
					<SubtitleIcons />
				</IconButton>
			</Menu.Target>
			<Menu.Dropdown
				className={cx(classes.backgroundStyle, classes.backgroundStyle)}
				p="lg"
			>
				<Flex>
					<Flex direction="column">
						<Menu.Label
							style={{
								alignSelf: 'flex-start',
							}}
						>
							Audio
						</Menu.Label>
						{tracks.map((track) => (
							<Menu.Item
								icon={
									<SelectIcon
										shown={
											selectedTrack?.track?.language ===
											track.track.language
										}
									/>
								}
								key={track.track.id}
								onClick={() => selectTrack(track)}
							>
								<Text>{track.display}</Text>
							</Menu.Item>
						))}
					</Flex>
					<Flex direction="column">
						<Menu.Label
							style={{
								alignSelf: 'flex-start',
							}}
						>
							Subtitles
						</Menu.Label>
						<Menu.Item
							onClick={toggleVisibility}
							icon={<SelectIcon shown={!isVisible} />}
						>
							Off
						</Menu.Item>
						{subtitleTracks.map((track) => (
							<Menu.Item
								icon={
									<SelectIcon
										shown={
											selectedSubtitleTracks?.track
												?.language ===
												track.track.language &&
											isVisible
										}
									/>
								}
								key={track.track.id}
								onClick={() => selectSubtitleTrack(track)}
							>
								<Text>{track.display}</Text>
							</Menu.Item>
						))}
					</Flex>
				</Flex>
			</Menu.Dropdown>
		</Menu>
	);
}
