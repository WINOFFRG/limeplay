export default function hookDefaultValue(name: string) {
	return () => {
		console.error(`${name} must be injected before accessing its values`);
	};
}
