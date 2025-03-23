import { Flex, Group, Stack, UnstyledButton } from '@mantine/core';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useLimeplay } from '@limeplay/core';
import VolumeControl from '../VolumeControl';
import { PlaybackControl } from '../PlaybackControl';
import { SeekControl } from '../SeekControl';
import { QualityMenu } from '../QualityMenu';
import { FullscreenControl } from '../FullScreenControl';
import { TimelineSlider } from '../Timeline';
import { PipControl } from '../PipControl';
import { AudioMenu } from '../AudioMenu';
import { MaximizeIcon, MinimizeIcon } from '../Icons/Icons';

export default function ControlsOverlay() {
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
					<Flex gap="sm">
						<PipControl />
						<FullscreenControl />
						<RedirectControl />
					</Flex>
				</Group>
			</Stack>
		</Stack>
	);
}

function RedirectControl() {
	const router = useRouter();
	const isHomePage = useMemo(
		() => router.pathname === '/',
		[router.pathname]
	);

	const { playbackRef } = useLimeplay();

	const togglePage = () => {
		const time = playbackRef.current.currentTime;

		if (!isHomePage) {
			router.push({
				pathname: '/',
				query: { t: time },
			});
		} else {
			router.push({
				pathname: '/player',
				query: { t: time },
			});
		}
	};

	return (
		<UnstyledButton onClick={togglePage}>
			{isHomePage ? <MaximizeIcon /> : <MinimizeIcon />}
		</UnstyledButton>
	);
}
