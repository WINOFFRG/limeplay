import * as Sentry from '@sentry/nextjs';
import limeplayPackageJson from '@limeplay/core/package.json';

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	release: `limeplay-@${limeplayPackageJson.version}`,
	tracesSampleRate: 1,
	debug: false,
	replaysOnErrorSampleRate: 1.0,
	replaysSessionSampleRate: 0.1,
	integrations: [
		new Sentry.Replay({
			maskAllText: true,
			blockAllMedia: true,
		}),
	],
	enabled: process.env.NODE_ENV === 'production',
});
