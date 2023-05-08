import type { AppProps } from 'next/app';
import { createEmotionSsrAdvancedApproach } from 'tss-react/next/pagesDir';
import AppStyles from '@/styles/AppStyles';
import { MetaTags } from '@/components/Layout/MetaTags';

const { augmentDocumentWithEmotionCache } = createEmotionSsrAdvancedApproach({
	key: 'tss',
});

export { augmentDocumentWithEmotionCache };

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<MetaTags />
			<AppStyles />
			<Component {...pageProps} />
		</>
	);
}
