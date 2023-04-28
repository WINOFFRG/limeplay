import { useInView } from 'framer-motion';
import dynamic from 'next/dynamic';
import { memo, useEffect, useState } from 'react';

function _LimeplayPlayer({
	parentRef: ref,
}: {
	parentRef: React.RefObject<HTMLDivElement>;
}) {
	const [Player, setPlayer] = useState(null);
	const inView = useInView(ref, { amount: 0.6, once: true });

	useEffect(() => {
		const limeplayInstance = dynamic(
			async () => (await import('@limeplay/core')).Player,
			{
				ssr: false,
			}
		);

		setPlayer(limeplayInstance);
	}, []);

	return Player && inView && <Player />;
}

export const LimeplayPlayer = memo(_LimeplayPlayer);
