import { useCallback, useEffect, useRef, useState } from 'react';

export default function PlaybackButton() {
	const video = useRef<HTMLVideoElement>(null);

	if (!video) return null;

	const [isPlaying, setIsPlaying] = useState(false);

	console.log('isPlaying', isPlaying);

	return <button />;
}
