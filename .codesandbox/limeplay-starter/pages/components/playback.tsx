import { usePlayback } from "@limeplay/core";
import { Play, Pause } from "@phosphor-icons/react";
import { IconButton } from "./ui";

export function PlaybackControl() {
	const { isPlaying, togglePlayback } = usePlayback();

	return (
		<IconButton
			aria-label={isPlaying ? "Pause" : "Play"}
			onClick={togglePlayback}
		>
			{isPlaying ? (
				<Pause className='action-icon' />
			) : (
				<Play className='action-icon' />
			)}
		</IconButton>
	);
}
