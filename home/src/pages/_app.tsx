import type { AppProps } from 'next/app';
import { createEmotionSsrAdvancedApproach } from 'tss-react/next/pagesDir';
import AppStyles from '@/styles/AppStyles';

const { augmentDocumentWithEmotionCache, withAppEmotionCache } =
	createEmotionSsrAdvancedApproach({ key: 'tss' });

export { augmentDocumentWithEmotionCache };

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<AppStyles />
			<Component {...pageProps} />
		</>
	);
}
