import { MantineProvider } from '@mantine/styles';

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
