import { useLimeplay } from '@limeplay/core';
import { Flex } from '@mantine/core';
import { IconButton } from '@/components/common/Buttons';
import { Forward10, Reverse10 } from '../Icons/Icons';

export function SeekControl() {
	const { playbackRef } = useLimeplay();

	return (
		<Flex>
			<IconButton
				arial-label="Rewind 10 seconds"
				onClick={() => {
					playbackRef.current.currentTime -= 10;
				}}
			>
				<Reverse10 />
			</IconButton>
			<IconButton
				aria-label="Forward 10 seconds"
				onClick={() => {
					playbackRef.current.currentTime += 10;
				}}
			>
				<Forward10 />
			</IconButton>
		</Flex>
	);
}
