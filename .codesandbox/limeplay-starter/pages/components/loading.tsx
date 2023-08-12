import { useLoading } from "@limeplay/core";
import { Spinner } from "@phosphor-icons/react";

export default function Loader() {
	const { isLoading } = useLoading();

	return (
		isLoading && <Spinner className='w-16 h-16 animate-spin opacity-70' />
	);
}
