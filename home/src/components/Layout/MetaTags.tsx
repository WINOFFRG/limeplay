/* eslint-disable react/no-unused-prop-types */
import { truncate } from 'lodash';
import Head from 'next/head';
import { useRouter } from 'next/router';

export type OGVideo = {
	/** Absolute URL pointing to an .mp4 video. Must be served over HTTPS. */
	src: string;
	/**
	 * Width of the source video.
	 *
	 * @note MUST match the dimensions of the OG image to avoid ugly borders.
	 */
	width: number;
	/**
	 * Height of the source video.
	 *
	 * @note MUST match the dimensions of the OG image to avoid ugly borders.
	 */
	height: number;
};

export type MetaTagsProps = {
	title?: string;
	description?: string;
	image?: string | false;
	imageAlt?: string;
	video?: OGVideo;
	noIndex?: boolean;
	imgToPreload?: string[];
	fontToPreload?: string[];
	themeColor?: string;
	favicon?: string;
	children?: React.ReactNode;
};

const useCurrentPath = () => useRouter().asPath.split('?')[0];
const BASE_URL = `https://limeplay.me`;

export function MetaTags(props: MetaTagsProps) {
	const {
		description: localDesc,
		title: localTitle,
		image: localImage,
		imageAlt: localImageAlt,
		themeColor,
		favicon,
		children,
	} = props;

	const title = localTitle || 'Limeplay';
	const image =
		localImage === false
			? null
			: localImage || 'https://limeplay.me/og/default.jpg';
	// Twitter has a max of 420 characters for image alt text
	const imageAlt = localImageAlt
		? truncate(localImageAlt, { length: 420, omission: '…' })
		: undefined;
	const path = useCurrentPath();
	const theme = {
		color: {
			pageBg: '#000212',
		},
	};

	const description =
		localDesc ||
		'Modern Headless UI Library for Media Player in React (Supports HTML5 & Shaka Player). Use with any skin - Netflix, Youtube, Spotify, Hulu, Disney+ ...';

	return (
		<>
			<Head>
				<meta key="charset" charSet="utf-8" />
				<title key="title">{title}</title>

				<meta
					key="viewport"
					name="viewport"
					content="width=device-width, height=device-height, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
				/>

				<meta
					key="twitterTitle"
					property="twitter:title"
					content={title}
				/>
				<meta key="ogTitle" property="og:title" content={title} />

				<meta
					key="apple-webapp"
					name="apple-mobile-web-app-capable"
					content="yes"
				/>
				<meta
					key="apple-webapp-status-style"
					name="apple-mobile-web-app-status-bar-style"
					content="black"
				/>
				<meta
					key="theme-color"
					name="theme-color"
					content={themeColor ?? theme.color.pageBg ?? '#060606'}
				/>
				<link
					key="manifest"
					rel="manifest"
					href="/static/pwa.webmanifest?v=3"
				/>

				{/* Favicons */}
				<link
					key="favicon"
					rel="icon"
					href="/static/favicon.ico"
					sizes="any"
				/>
				<link
					key="favicon-svg"
					rel="icon"
					href={favicon ?? `/static/favicon.svg`}
				/>
				<link
					key="favicon-touch-icon"
					rel="apple-touch-icon"
					sizes="180x180"
					href="/static/apple-touch-icon.png"
				/>
				<link
					key="favicon-safari-svg"
					rel="mask-icon"
					href="/static/limeplay-safari.svg"
					color="#5E6AD2;"
				/>

				{/* URL */}
				<link key="canonical" rel="canonical" href={BASE_URL + path} />
				<meta key="ogUrl" property="og:url" content={BASE_URL + path} />

				{/* OG & Twitter */}
				<meta
					key="twitterSite"
					property="twitter:site"
					content="@winoffrg"
				/>
				<meta
					key="twitterCreator"
					property="twitter:creator"
					content="@winoffrg"
				/>
				<meta
					key="ogSiteName"
					property="og:site_name"
					content="Limeplay"
				/>
				<meta key="ogType" property="og:type" content="website" />

				{image && (
					<>
						<meta
							key="twitterCard"
							property="twitter:card"
							content="summary_large_image"
						/>
						<meta
							key="twitterImage"
							property="twitter:image"
							content={image}
						/>
						<meta
							key="ogImage"
							property="og:image"
							content={image}
						/>
						<meta property="og:image:width" content="1200" />
						<meta property="og:image:height" content="630" />
					</>
				)}

				{imageAlt && (
					<>
						<meta
							key="ogImageAlt"
							property="og:image:alt"
							content={imageAlt}
						/>
						<meta
							key="twitterImageAlt"
							property="twitter:image:alt"
							content={imageAlt}
						/>
					</>
				)}

				{description && (
					<>
						<meta
							key="description"
							name="description"
							content={description}
						/>
						<meta
							key="twitterDescription"
							property="twitter:description"
							content={description}
						/>
						<meta
							key="ogDescription"
							property="og:description"
							content={description}
						/>
					</>
				)}
			</Head>

			{children}
		</>
	);
}
