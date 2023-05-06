import * as React from 'react';

import createEmotionServer from '@emotion/server/create-instance';
import Document, {
	DocumentContext,
	Head,
	Html,
	Main,
	NextScript,
} from 'next/document';
import { emotionCache } from '@/styles/theme';

const { extractCritical } = createEmotionServer(emotionCache);

export default class CustomDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		const styles = extractCritical(initialProps.html);
		return {
			...initialProps,
			styles: [
				initialProps.styles,
				<style
					key="emotion-css"
					dangerouslySetInnerHTML={{ __html: styles.css }}
					data-emotion-css={styles.ids.join(' ')}
				/>,
			],
		};
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<meta charSet="UTF-8" />
					<meta content="ie=edge" httpEquiv="X-UA-Compatible" />
				</Head>

				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
