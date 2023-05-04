import React from 'react';
import { LimeplayContext } from '../../store/context';
import { createLimeplayStore } from '../../store';

export function LimeplayProvider({ children }: { children: React.ReactNode }) {
	const store = createLimeplayStore();

	return (
		<LimeplayContext.Provider value={store}>
			{children}
		</LimeplayContext.Provider>
	);
}
