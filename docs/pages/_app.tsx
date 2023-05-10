// import '@/styles/globals.css'
import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import Head from 'next/head';
import { getSeo } from 'utils/seo';

export default function App({ Component, pageProps }: AppProps) {
	const seo = getSeo();

	return (
		<>
			<Head>
				<meta content="IE=edge" httpEquiv="X-UA-Compatible" />
				<meta
					content="width=device-width, initial-scale=1"
					name="viewport"
				/>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://static.cloudflareinsights.com"
				/>
				<link
					rel="icon"
					type="image/x-icon"
					href="https://limeplay.me/favicon/favicon.ico"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="https://limeplay.me/favicon/favicon-16x16.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="https://limeplay.me/favicon/favicon-32x32.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="https://limeplay.me/favicon/apple-touch-icon.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="https://limeplay.me/favicon/apple-touch-icon.png"
				/>
				<link
					rel="manifest"
					href="https://limeplay.me/favicon/site.webmanifest"
				/>
			</Head>
			<DefaultSeo {...seo} />
			<Component {...pageProps} />
		</>
	);
}
