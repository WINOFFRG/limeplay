import { useEffect, useState } from 'react';
import o9n from 'o9n';

export interface UseOrientationConfig {
	onError?: (error: Error) => void;
}

interface O9nOrientation {
	type: ScreenOrientation;
	angle: 0 | 90 | 180 | 270;
	onChange: (event: Event) => void;
}

// Refer: https://github.com/chmanie/o9n#api
export function useOrientation({ onError }: UseOrientationConfig = {}) {
	const [orientation, setOrientation] = useState<O9nOrientation>(
		o9n.orientation
	);

	const orientationError = (error: Error) => {
		if (onError && typeof onError === 'function') {
			onError(error);
		}
	};

	const lockOrientation = (type: OrientationLockType) => {
		o9n.orientation.lock(type).catch(orientationError);
	};

	const unlockOrientation = () => {
		o9n.orientation.unlock();
	};

	const toggleOrientation = () => {
		if (o9n.orientation.angle === 0 || o9n.orientation.angle === 180) {
			lockOrientation('landscape');
		} else {
			lockOrientation('portrait');
		}
	};

	useEffect(() => {
		const orientationEventHandler = () => {
			setOrientation(o9n.orientation);
		};

		o9n.orientation.addEventListener('change', orientationEventHandler);

		return () => {
			o9n.orientation.removeEventListener(
				'change',
				orientationEventHandler
			);
		};
	}, []);

	return {
		orientation,
		lockOrientation,
		unlockOrientation,
		toggleOrientation,
		api: o9n.orientation,
	};
}
