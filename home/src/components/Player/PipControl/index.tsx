import { usePiP } from '@limeplay/core';
import { useHotkeys } from '@mantine/hooks';
import { PipEnter, PipExit } from '../Icons/Icons';
import { IconButton } from '@/components/common/Buttons';

export function PipControl() {
	const { isPiPActive, isPiPAllowed, togglePiP } = usePiP();

	useHotkeys([['p', () => togglePiP()]]);

	return null;

	return (
		<IconButton
			aria-label={isPiPActive ? 'Exit PiP' : 'Enter PiP'}
			disabled={!isPiPAllowed}
			onClick={togglePiP}
		>
			{isPiPActive ? <PipExit /> : <PipEnter />}
		</IconButton>
	);
}
