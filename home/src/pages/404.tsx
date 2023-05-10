import { MotionConfig } from 'framer-motion';
import { Text, Title } from '@mantine/core';
import { Layout } from '@/components/Layout/Layout';
import { MetaTags } from '@/components/Layout/MetaTags';

export default function Home() {
	return (
		<Layout>
			<MetaTags title="Not found" image={false} noIndex />
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					textAlign: 'center',
					flex: '1 1 0',
					minHeight: '60vh',
				}}
			>
				<div
					style={{
						margin: '0 auto',
					}}
				>
					<svg width="128" fill="#5E6AD2" viewBox="0 0 112 138">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M12 4h88a8 8 0 018 8v108H4V12a8 8 0 018-8zM0 12C0 5.373 5.373 0 12 0h88c6.627 0 12 5.373 12 12v112h-8.131v13.156H10V124H0V12zm21.603 5.953h67.954c.565 0 1.023.458 1.023 1.023V72.93c0 .565-.458 1.023-1.023 1.023H21.603a1.023 1.023 0 01-1.023-1.023V18.976c0-.565.458-1.023 1.023-1.023zm-5.023 1.023a5.023 5.023 0 015.023-5.023h67.954a5.023 5.023 0 015.023 5.023V72.93a5.023 5.023 0 01-5.023 5.023H21.603a5.023 5.023 0 01-5.023-5.023V18.976zm83.29 105.522H14v8.658h85.87v-8.658zM92.433 93.94H64.81v5.074h27.626V93.94zm-80.877 10.074h10.046v5.074H11.557v-5.074zm18.836-78.9h-3.767v5.165h3.767v-5.165zm5.023 0h3.767v5.165h-3.767v-5.165zm12.557 0h-3.767v5.165h3.767v-5.165zm5.023 0h3.767v5.165h-3.767v-5.165zm12.557 0h-3.767v5.165h3.767v-5.165zm5.023 0h3.767v5.165h-3.767v-5.165zM30.393 35.16h-3.767v5.164h3.767V35.16zm5.023 0h3.767v5.164h-3.767V35.16zm12.557 0h-3.767v5.164h3.767V35.16zm5.023 0h3.767v5.164h-3.767V35.16zM30.393 45.206h-3.767v5.164h3.767v-5.164zm5.023 0h3.767v5.164h-3.767v-5.164zM30.393 55.25h-3.767v5.165h3.767v-5.164zm5.023 0h3.767v5.165h-3.767v-5.164zm12.557 0h-3.767v5.165h3.767v-5.164zm12.624-6.76l3.114-3.115 7.41 7.41 7.007-7.006 3.293 3.294-7.006 7.007 7.41 7.41-3.114 3.114-7.41-7.41-7.007 7.006-3.293-3.294 7.006-7.006-7.41-7.41z"
						/>
					</svg>
					<Title order={1}>Not found</Title>
					<Text>
						The page you&apos;re trying to access does not exist.
					</Text>
				</div>
			</div>
		</Layout>
	);
}
