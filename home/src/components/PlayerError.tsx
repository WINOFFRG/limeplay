import { Anchor, Flex, Stack, Text, Title, Image } from '@mantine/core';

export function PlayerError({ error }: { error: Error }) {
	return (
		<Flex
			align="center"
			justify="center"
			mih={600}
			bg="dark"
			m={1}
			p="lg"
			sx={() => ({
				flexDirection: 'row',

				'@media (max-width: 768px)': {
					flexDirection: 'column',
					padding: '1rem',
				},
			})}
		>
			<Image alt="error" src="/waiting.png" />
			<Stack>
				<Title fw={600}>Something went wrong!</Title>
				<Text color="gray" fw={400}>
					An unexpected error occurred while playing this content.
					Please try again or report this issue on &nbsp;
					<Anchor
						c="inherit"
						td="underline"
						href="https://github.com/WINOFFRG/limeplay/issues"
					>
						Github
					</Anchor>
					, Thanks!
				</Text>
				<Text color="gray.6" fw={500}>
					Details: {error?.message}
				</Text>
			</Stack>
		</Flex>
	);
}
