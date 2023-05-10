import React, { useCallback, useMemo, useState } from 'react';
import {
	MantineProvider,
	ColorSchemeProvider,
	ColorScheme,
	Global,
	createEmotionCache,
} from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import rtlPlugin from 'stylis-plugin-rtl';
import { Inter } from 'next/font/google';
import { LayoutInner } from './LayoutInner';
import { DirectionContext } from './DirectionContext';

export const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
});

const THEME_KEY = 'limeplay-color-scheme';

const rtlCache = createEmotionCache({
	key: 'mantine-rtl',
	prepend: true,
	stylisPlugins: [rtlPlugin],
});

export default function Layout({ children }: { children: React.ReactNode }) {
	const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
	const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
		key: THEME_KEY,
		defaultValue: 'dark',
		getInitialValueInEffect: true,
	});

	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	const toggleDirection = useCallback(
		() => setDir((current) => (current === 'rtl' ? 'ltr' : 'rtl')),
		[]
	);

	useHotkeys([
		['mod+J', () => toggleColorScheme()],
		['mod + shift + L', () => toggleDirection()],
	]);

	const initialContextValue = useMemo(
		() => ({ dir, toggleDirection }),
		[dir]
	);

	return (
		<DirectionContext.Provider value={initialContextValue}>
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
								fontFamily: `"var(--font-inter)", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`,
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
