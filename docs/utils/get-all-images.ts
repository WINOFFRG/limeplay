/* eslint-disable @typescript-eslint/no-var-requires */
const glob = require('glob');

export const getImagesByPath = (route: string): string[] => {
	const path = `./public/images/${route}/*.{jpg,png}`;
	return glob.sync(path).map((file) => {
		let finalPath = file.replace('public', '');
		finalPath = finalPath.replace(/\\/g, '/');
		return finalPath;
	});
};
