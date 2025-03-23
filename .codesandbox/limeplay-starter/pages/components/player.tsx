import { LimeplayProvider, MediaOutlet } from '@limeplay/core';
import PlayerOverlay from './overlay';

/**
 	1. LimeplayProvider is the context provider for the player. It contains
	player and the playback element in states and references. To access
	those you will need to use the useLimeplay hook.

	2. PlayerOverlay is a component that will be rendered on top of the player.
	It can be used to render custom controls or any other UI elements.
	The order doesn't matter here, Just the MediaOutlet and your custom
	overlay should all be wrapped inside the LimeplayProvider.

	3. MediaOutlet is a HTMLMediaElement aware component that will automatically
	attach the player to the media element. It can only have one child which
	is the media element (Audio or Video) itself.
 */

export default function LimeplayPlayer() {
	return (
		<LimeplayProvider>
			<PlayerOverlay />
			<MediaOutlet>
				<video
					className="bg-black w-full h-full "
					controls={false}
					playsInline
					autoPlay
					muted
					poster="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/animated.webp?start=268&end=278&width=640"
				/>
			</MediaOutlet>
		</LimeplayProvider>
	);
}
