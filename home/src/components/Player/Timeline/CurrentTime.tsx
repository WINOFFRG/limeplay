import ControlButton from '../ControlButton';
import { buildTimeString } from './utils';

export function CurrentTime({
	playback,
	player,
	isLive,
	duration,
	currentTime,
	seekRange,
}: {
	playback: HTMLMediaElement;
	player: shaka.Player;
	isLive: boolean;
	duration: number;
	currentTime: number;
	seekRange: SeekRange;
}) {
	return (
		<span>
			{!isLive && buildTimeString(currentTime, duration > 3600)}
			{isLive && (
				<ControlButton
					onClick={() => {
						player.goToLive();
					}}
					style={{
						width: 'auto',
					}}
				>
					{seekRange.end - playback.currentTime > 5
						? `-${buildTimeString(
								seekRange.end - playback.currentTime,
								duration > 3600
						  )}`
						: 'LIVE'}
				</ControlButton>
			)}
		</span>
	);
}
