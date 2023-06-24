import { useQuality } from '@limeplay/core';
import { ActionIcon, Box, Button, Menu, Text, Title } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export function QualityMenu({ player }: { player: shaka.Player }) {
	const { isAuto, selectedTrack, tracks, selectTrack, setAutoMode } =
		useQuality({
			player,
			clearBufferOnChange: true,
		});

	console.log(tracks);

	return (
		<Menu
			shadow="md"
			width={160}
			trigger="hover"
			offset={40}
			withArrow
			transitionProps={{ transition: 'fade', duration: 100 }}
			closeDelay={200}
		>
			<Menu.Target>
				<ActionIcon>⚒️</ActionIcon>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Label>Select Quality</Menu.Label>
				<Menu.Item
					onClick={setAutoMode}
					icon={
						isAuto ? <IconCheck size={18} /> : <Box w={18} h={18} />
					}
				>
					Auto
					{isAuto && (
						<Text fz="xs">Current: {selectedTrack.height}p</Text>
					)}
				</Menu.Item>
				{tracks.map((track) => (
					<Menu.Item
						icon={
							track.id === selectedTrack.id && !isAuto ? (
								<IconCheck size={18} />
							) : (
								<Box w={18} h={18} />
							)
						}
						key={track.id}
						onClick={() => selectTrack(track)}
					>
						<Text>{track.height}p</Text>
					</Menu.Item>
				))}
			</Menu.Dropdown>
		</Menu>
	);
}
