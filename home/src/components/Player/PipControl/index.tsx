import { usePiP } from '@limeplay/core';
import { PipEnter, PipExit } from '../Icons/Icons';
import { IconButton } from '@/components/common/Buttons';

export function PipControl() {
	const { isPiPActive, isPiPAllowed, togglePiP } = usePiP();

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
