import { Flex } from '@mantine/core';
import dynamic from 'next/dynamic';

const LimeplayPlayer = dynamic(() => import('@/components/Player'), {
	ssr: false,
});

export default function Player() {
	return (
		<Flex w="100vw" h="100vh" id="limeplay-player" align="center">
			<LimeplayPlayer />
		</Flex>
	);
}
