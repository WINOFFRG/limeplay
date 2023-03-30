export default function getDuration(player: shaka.Player) {
	const seekRange = player.seekRange();

	return seekRange.end - seekRange.start;
}
