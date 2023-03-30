import { MantineProvider } from '@mantine/styles';
import createContext from 'zustand/context';

export default function LimeplayProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				colorScheme: 'dark',
				defaultRadius: '50%',
			}}
		>
			{children}
		</MantineProvider>
	);
}
