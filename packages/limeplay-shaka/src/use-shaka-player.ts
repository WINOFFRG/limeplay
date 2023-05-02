import shaka from 'shaka-player';

export function useShakaPlayer(
	mediaElement?: React.MutableRefObject<HTMLMediaElement>
): shaka.Player {
	const player = new shaka.Player(mediaElement?.current);

	return player;
}
