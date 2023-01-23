import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo';
import Head from 'next/head';
import FontFace from 'components/font-face';
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
                <link
                    rel="icon"
                    type="image/png"
                    sizes="96x96"
                    href="/favicon.png"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://static.cloudflareinsights.com"
                />
                <meta name="theme-color" content="#319795" />
            </Head>
            <DefaultSeo {...seo} />
            <Component {...pageProps} />
            <FontFace />
        </>
    );
}
