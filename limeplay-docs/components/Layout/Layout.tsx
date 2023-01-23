import React, { useState } from 'react';
import {
    MantineProvider,
    ColorSchemeProvider,
    ColorScheme,
    Global,
    createEmotionCache,
} from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import rtlPlugin from 'stylis-plugin-rtl';
import { LayoutInner } from './LayoutInner';
import { DirectionContext } from './DirectionContext';

const THEME_KEY = 'mantine-color-scheme';

const rtlCache = createEmotionCache({
    key: 'mantine-rtl',
    prepend: true,
    stylisPlugins: [rtlPlugin],
});

export default function Layout({ children }: { children: React.ReactNode }) {
    const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: THEME_KEY,
        defaultValue: 'light',
        getInitialValueInEffect: true,
    });

    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    const toggleDirection = () =>
        setDir((current) => (current === 'rtl' ? 'ltr' : 'rtl'));

    useHotkeys([
        ['mod+J', () => toggleColorScheme()],
        ['mod + shift + L', () => toggleDirection()],
    ]);

    return (
        <DirectionContext.Provider value={{ dir, toggleDirection }}>
            <ColorSchemeProvider
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
            >
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        dir,
                        colorScheme,
                    }}
                    emotionCache={dir === 'rtl' ? rtlCache : undefined}
                >
                    <Global
                        styles={(theme) => ({
                            body: {
                                color:
                                    theme.colorScheme === 'dark'
                                        ? theme.colors.dark[1]
                                        : theme.colors.gray[8],
                                fontSize: 15,
                            },
                        })}
                    />
                    <div dir={dir}>
                        <LayoutInner>{children}</LayoutInner>
                    </div>
                </MantineProvider>
            </ColorSchemeProvider>
        </DirectionContext.Provider>
    );
}
