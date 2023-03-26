import { Slider } from '@mantine/core';
import Image from 'next/image';
import { Carousel } from '@mantine/carousel';

export default function Test() {
	return (
		<Carousel maw={320} mx="auto" withIndicators height={200}>
			<Carousel.Slide>1</Carousel.Slide>
			<Carousel.Slide>2</Carousel.Slide>
			<Carousel.Slide>3</Carousel.Slide>
			{/* ...other slides */}
		</Carousel>
	);
}
