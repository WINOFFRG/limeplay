import { Box } from '@mantine/core';

export default function LayoutContent({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Box
			pl="var(--page-padding-left)"
			pr="var(--page-padding-right)"
			maw="var(--page-max-width)"
			mx="auto"
		>
			{children}
		</Box>
	);
}
