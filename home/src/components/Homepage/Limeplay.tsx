import { useInView, motion } from 'framer-motion';
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
	const inView = useInView(ref, { amount: 0.8, once: true });
	return (
		<motion.div
			style={{
				position: 'relative',
				padding: '1px 1px 0 0',
				overflow: 'hidden',
				borderRadius: '5px',
				display: inView ? 'block' : 'none',
			}}
			id="limeplay-player"
			initial={{ opacity: 0.4 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 3, ease: 'easeInOut' }}
		>
			{inView && <LimeplayPlayer />}
		</motion.div>
	);
}

export const LimeplayWrapper = memo(_LimeplayPlayer);
