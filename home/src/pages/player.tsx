import { useRef } from 'react';
import { LimeplayPlayer } from '@/components/Homepage/Limeplay';

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
			<LimeplayPlayer parentRef={ref} />
		</div>
	);
}
