import React from 'react';
import ReactDOM from 'react-dom/client';

import './globals.css';
import './fonts/Graphik-Medium.woff';
import LimeplayProvider from './components/LimeplayProvider';
import Player from './components/Player';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<LimeplayProvider>
			<Player />
			<Player />
		</LimeplayProvider>
	</React.StrictMode>
);
