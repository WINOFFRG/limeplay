import { MotionConfig } from 'framer-motion';
import { Layout } from '@/components/Layout/Layout';
import { Hero } from '@/components/Homepage/Hero';

export default function Home() {
	return (
		<Layout>
			<MotionConfig reducedMotion="user">
				<Hero />
			</MotionConfig>
		</Layout>
	);
}
