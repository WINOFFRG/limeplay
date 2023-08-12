import { useVolume } from "@limeplay/core";
import { IconButton } from "./ui";
import { SpeakerHigh, SpeakerX } from "@phosphor-icons/react";

export function VolumeControl() {
	const { muted, toggleMute } = useVolume();

	return (
		<IconButton aria-label={muted ? "Unmute" : "Mute"} onClick={toggleMute}>
			{muted ? (
				<SpeakerX className='action-icon' />
			) : (
				<SpeakerHigh className='action-icon' />
			)}
		</IconButton>
	);
}
