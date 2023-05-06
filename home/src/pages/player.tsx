import dynamic from 'next/dynamic';

const LimeplayPlayer = dynamic(() => import('@/components/Player'), {
	ssr: false,
});

export default function Player() {
	return (
		<div
			style={{
				width: '100vw',
				height: '100vh',
			}}
			id="limeplay-player"
		>
			<LimeplayPlayer />
		</div>
	);
}
