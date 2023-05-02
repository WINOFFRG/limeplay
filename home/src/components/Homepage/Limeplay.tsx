import { useInView } from 'framer-motion';
import dynamic from 'next/dynamic';
import { memo } from 'react';

const LimeplayPlayer = dynamic(() => import('@/components/Player'), {
	ssr: false,
});

function _LimeplayPlayer({
	parentRef: ref,
}: {
	parentRef: React.RefObject<HTMLDivElement>;
}) {
	const inView = useInView(ref, { amount: 0.6, once: true });
	return (
		<div
			style={{
				position: 'relative',
			}}
		>
			{inView && <LimeplayPlayer />}
		</div>
	);
}

export const LimeplayWrapper = memo(_LimeplayPlayer);
