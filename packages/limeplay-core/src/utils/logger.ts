import log from 'loglevel';

export const logger = log.getLogger('limeplay-core');

logger.setLevel('DEBUG');

// create a format

const format = (level: string, name: string, timestamp: string) =>
	`${timestamp} [${level.toUpperCase()}] ${name}:`;
