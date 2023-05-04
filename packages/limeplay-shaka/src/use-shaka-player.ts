import shaka from 'shaka-player';

export interface CreateShakaPlayerProps {
	mediaElement: HTMLMediaElement;
}

export type CreatePlayer = (props: CreateShakaPlayerProps) => shaka.Player;

function createPlayer({ mediaElement }: CreateShakaPlayerProps): shaka.Player {
	const player = new shaka.Player(mediaElement);

	return player;
}

export function useShakaPlayer() {
	return createPlayer;
}
