export function buildTimeString(displayTime: number, showHour: boolean) {
	const h = Math.floor(displayTime / 3600);
	const m = Math.floor((displayTime / 60) % 60);
	const time: number = Math.floor(displayTime % 60);

	let s = time.toString();

	if (time < 10) {
		s = `0${s}`;
	}

	let text = `${m}:${s}`;

	if (showHour) {
		if (m < 10) {
			text = `0${text}`;
		}
		text = `${h}:${text}`;
	}

	return text;
}
