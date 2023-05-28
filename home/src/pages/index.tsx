import { MotionConfig } from 'framer-motion';
import { Layout } from '@/components/Layout/Layout';
import { Hero } from '@/components/Homepage/Hero';
import Themes from '@/components/Homepage/Themes';

export default function Home() {
	return (
		<Layout>
			<MotionConfig reducedMotion="user">
				<Hero />
				<Themes />
			</MotionConfig>
		</Layout>
	);
}
