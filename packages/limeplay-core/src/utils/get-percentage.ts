export default function getPercentage(
	time: number,
	total: number,
	PRECISION = 3
) {
	return Math.round((time / total) * 100 * 10 ** PRECISION) / 10 ** PRECISION;
}
