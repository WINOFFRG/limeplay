import { createContext, useContext, useState } from 'react';
import { useStateRef } from '../utils';

interface LimeplayTimelineProviderContextType {
	currentTime: number;
	setCurrentTime: (time: number) => void;
	duration: number;
	setDuration: (duration: number) => void;
	durationRef: React.MutableRefObject<number>;
	isSeeking: boolean;
	setIsSeeking: (isSeeking: boolean) => void;
	isSeekingRef: React.MutableRefObject<boolean>;
	currentProgress: number;
	setCurrentProgress: (progress: number) => void;
	seekRange: SeekRange;
	setSeekRange: (seekRange: SeekRange) => void;
	seekRangeRef: React.MutableRefObject<SeekRange>;
}

const LimeplayTimelineProviderContext = createContext<
	LimeplayTimelineProviderContextType | undefined
>(undefined);

export function useLimeplayTimeline() {
	const context = useContext(LimeplayTimelineProviderContext);

	if (!context) {
		throw new Error(
			`useLimeplayTimeline hook must be used within a LimeplayTimelineProvider`
		);
	}

	return context;
}

export function LimeplayTimelineProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration, durationRef] = useStateRef(0);
	const [isSeeking, setIsSeeking, isSeekingRef] = useStateRef(false);
	const [currentProgress, setCurrentProgress] = useState(0);
	const [seekRange, setSeekRange, seekRangeRef] = useStateRef<SeekRange>({
		start: 0,
		end: 0,
	});

	const providerValue = {
		currentTime,
		setCurrentTime,
		duration,
		setDuration,
		durationRef,
		isSeeking,
		setIsSeeking,
		isSeekingRef,
		currentProgress,
		setCurrentProgress,
		seekRange,
		setSeekRange,
		seekRangeRef,
	};

	return (
		<LimeplayTimelineProviderContext.Provider value={providerValue}>
			{children}
		</LimeplayTimelineProviderContext.Provider>
	);
}
