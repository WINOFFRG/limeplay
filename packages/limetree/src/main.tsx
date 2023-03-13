import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/styles';

import FullScreenPlayer from './components/FullScreenPlayer';
import './globals.css';
import './fonts/Graphik-Medium.woff';
import LimeplayProvider from './components/LimeplayProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<LimeplayProvider>
			<FullScreenPlayer />
		</LimeplayProvider>
	</React.StrictMode>
);
