import {
	ActionIcon,
	Button,
	Flex,
	Group,
	Space,
	Stack,
	Text,
} from '@mantine/core';
import VolumeControl from '../VolumeControl';
import useStyles from './styles';
import { PlaybackControl } from '../PlaybackControl';
import { SeekControl } from '../SeekControl';
import { QualityMenu } from '../QualityMenu';
import { FullscreenControl } from '../FullScreenControl';
import { TimelineSlider } from '../Timeline';
import { PipControl } from '../PipControl';
import { AudioMenu } from '../AudioMenu';

export default function ControlsOverlay() {
	const { classes } = useStyles();

	return (
		<Stack
			justify="space-between"
			h="100%"
			p="lg"
			style={{
				position: 'relative',
				zIndex: 10,
			}}
		>
			<Group position="apart">
				<Flex />
				<Flex gap="xl">
					<QualityMenu />
					<AudioMenu />
				</Flex>
			</Group>
			<Stack>
				<TimelineSlider />
				<Group position="apart">
					<Flex>
						<PlaybackControl />
						<SeekControl />
						<VolumeControl />
					</Flex>
					<Flex>
						<PipControl />
						<FullscreenControl />
					</Flex>
				</Group>
			</Stack>
		</Stack>
	);
}
