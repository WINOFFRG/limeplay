import * as React from 'react';
import { createGetInitialProps } from '@mantine/next';

import Document, { Head, Html, Main, NextScript } from 'next/document';

const getInitialProps = createGetInitialProps();

export default class CustomDocument extends Document {
	static getInitialProps = getInitialProps;

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
