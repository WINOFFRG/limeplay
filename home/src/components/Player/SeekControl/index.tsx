import { useLimeplay } from '@limeplay/core';
import { Flex } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { IconButton } from '@/components/common/Buttons';
import { Forward10, Reverse10 } from '../Icons/Icons';

export function SeekControl() {
	const { playbackRef } = useLimeplay();

	const seek = (direction: 'forward' | 'backward') => {
		if (direction === 'forward') {
			playbackRef.current.currentTime += 10;
		} else {
			playbackRef.current.currentTime -= 10;
		}
	};

	useHotkeys([
		['ArrowLeft', () => seek('backward')],
		['ArrowRight', () => seek('forward')],
	]);

	return (
		<Flex>
			<IconButton
				arial-label="Rewind 10 seconds"
				onClick={() => {
					seek('backward');
				}}
			>
				<Reverse10 />
			</IconButton>
			<IconButton
				aria-label="Forward 10 seconds"
				onClick={() => {
					seek('forward');
				}}
			>
				<Forward10 />
			</IconButton>
		</Flex>
	);
}
