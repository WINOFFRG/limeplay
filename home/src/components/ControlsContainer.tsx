import { PlayPause } from './player/PlayPause';

export function ControlsContainer() {
	return (
		<div
			id="controls_wrapper"
			className="absolute inset-0 isolate z-100 contain-strict"
		>
			{/* <div
				id="scrim_container"
				className="absolute inset-0 bg-black/30 bg-[linear-gradient(to_top,_rgba(0,0,0,0.3)_0,transparent_120px)]"
			/> */}
			<div
				id="controls_container"
				className="absolute inset-x-0 bottom-8 max-w-6xl px-[min(80px,10%)]"
			>
				<PlayPause />
			</div>
		</div>
	);
}
