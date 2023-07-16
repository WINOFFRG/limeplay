import { useEffect, useState } from 'react';
import o9n from 'o9n';

export interface UseOrientationConfig {
	onError?: (error: Error) => void;
	onLock?: () => void;
	onUnlock?: () => void;
	onChange?: (event: Event) => void;
}

// Refer: https://github.com/chmanie/o9n#api
export function useOrientation({
	onError,
	onLock,
	onUnlock,
	onChange,
}: UseOrientationConfig = {}) {
	const [orientation, setOrientation] = useState<ScreenOrientation>(
		o9n.orientation
	);

	const orientationError = (error: Error) => {
		if (onError && typeof onError === 'function') {
			onError(error);
		}
	};

	// TODO: OritentationType can be used but it has few missing as compared to API Docs, Need to add later
	const lockOrientation = (type: any) => {
		o9n.orientation
			.lock(type)
			.then(() => {
				if (onLock && typeof onLock === 'function') {
					onLock();
				}
			})
			.catch(orientationError);
	};

	const unlockOrientation = () => {
		o9n.orientation.unlock();

		if (onUnlock && typeof onUnlock === 'function') {
			onUnlock();
		}
	};

	const toggleOrientation = () => {
		if (o9n.orientation.angle === 0 || o9n.orientation.angle === 180) {
			lockOrientation('landscape');
		} else {
			lockOrientation('portrait');
		}
	};

	useEffect(() => {
		const orientationEventHandler = (_event: Event) => {
			setOrientation(o9n.orientation);

			if (onChange && typeof onChange === 'function') {
				onChange(_event);
			}
		};

		o9n.orientation.addEventListener('change', orientationEventHandler);

		return () => {
			o9n.orientation.removeEventListener(
				'change',
				orientationEventHandler
			);
		};
	}, [onChange]);

	return {
		orientation,
		lockOrientation,
		unlockOrientation,
		toggleOrientation,
		api: o9n.orientation,
	};
}
