import { useAudioTracks, useTextTracks } from '@limeplay/core';
import {
	Box,
	Flex,
	Menu,
	Text,
	UnstyledButton,
	createStyles,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { SubtitleIcons } from '../Icons/Icons';

const useStyles = createStyles(() => ({
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

	const {
		selectedTrack: selectedSubtitleTracks,
		tracks: subtitleTracks,
		selectTrack: selectSubtitleTrack,
		isVisible,
		toggleVisibility,
	} = useTextTracks();

	const { classes, cx } = useStyles();

	return (
		<Menu
			shadow="md"
			trigger="hover"
			transitionProps={{ transition: 'fade', duration: 100 }}
			closeDelay={200}
			styles={{
				dropdown: {
					background: 'rgba(0,0,0,0.64)',
					backdropFilter: 'blur(10px)',
					// marginLeft: -24,
				},
				arrow: {
					background: 'rgba(0,0,0,0.64)',
					backdropFilter: 'blur(10px)',
				},
			}}
		>
			<Menu.Target>
				<UnstyledButton
					display="flex"
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						gap: 8,
						padding: 8,
					}}
				>
					<SubtitleIcons />
					<Text fw={500}>Audio & Subtitles</Text>
				</UnstyledButton>
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
