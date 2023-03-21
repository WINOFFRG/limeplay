import { useEffect, useRef, useState } from 'react';

export default function useSample() {
	const value = useRef(0);

	useEffect(() => {
		console.log('useSample useEffect');
	}, []);

	return {
		value,
	};
}
