import { LimeplayProvider, MediaOutlet } from "@limeplay/core";
import PlayerOverlay from "./overlay";

export default function LimeplayPlayer() {
	return (
		<LimeplayProvider>
			<PlayerOverlay />
			<MediaOutlet>
				<video
					className='bg-black w-full h-full '
					controls={false}
					playsInline
					autoPlay
					muted
					poster='https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/animated.webp?start=268&end=278&width=640'
				/>
			</MediaOutlet>
		</LimeplayProvider>
	);
}
