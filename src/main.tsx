import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/styles';

import './globals.css';
import FullScreenPlayer from './components/FullScreenPlayer';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: 'dark',
                defaultRadius: '50%',

                fontSizes: {
                    xs: 12,
                    sm: 14,
                    md: 16,
                    lg: 18,
                    xl: 20,
                },
            }}
        >
            <FullScreenPlayer />
        </MantineProvider>
    </React.StrictMode>
);
