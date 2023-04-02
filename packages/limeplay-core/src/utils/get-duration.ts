import { Player } from 'shaka-player';

export default function getDuration(player: Player) {
	const seekRange = player.seekRange();

	return seekRange.end - seekRange.start;
}
