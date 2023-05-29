import { MotionConfig } from 'framer-motion';
import { Layout } from '@/components/Layout/Layout';
import { Hero } from '@/components/Homepage/Hero';
import Themes from '@/components/Homepage/Themes';
import ThemeCarousel, { Featured } from '@/components/Homepage/Carousel';

export default function Home() {
	return (
		<Layout>
			<MotionConfig reducedMotion="user">
				<Hero />
				<Themes />
				<Featured />
			</MotionConfig>
		</Layout>
	);
}
