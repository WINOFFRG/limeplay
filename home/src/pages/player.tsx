import { useRef } from 'react';
import dynamic from 'next/dynamic';

const LimeplayPlayer = dynamic(() => import('@/components/Player'), {
	ssr: false,
});

export default function Player() {
	const ref = useRef(null);

	return (
		<div
			ref={ref}
			style={{
				width: '100vw',
				height: '100vh',
			}}
		>
			<LimeplayPlayer />
		</div>
	);
}
