import { IconButton } from '@/components/common/Buttons';
import { buildTimeString } from './utils';

export function CurrentTime({
	isLive,
	player,
	duration,
	currentTime,
	liveLatency,
}: {
	isLive: boolean;
	player: shaka.Player;
	duration: number;
	currentTime: number;
	liveLatency: number;
}) {
	return (
		<span>
			{!isLive && buildTimeString(currentTime, duration > 3600)}
			{isLive && (
				<IconButton
					onClick={() => {
						player.goToLive();
					}}
					style={{
						width: 'auto',
					}}
				>
					{liveLatency > 5
						? `-${buildTimeString(liveLatency, duration > 3600)}`
						: 'LIVE'}
				</IconButton>
			)}
		</span>
	);
}
