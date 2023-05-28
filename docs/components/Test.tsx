import Image from 'next/image';
import { Carousel } from '@mantine/carousel';
import { Blurhash, BlurhashCanvas } from 'react-blurhash';
import { IGetPlaiceholderReturn } from 'plaiceholder';
import { createStyles, rem, em } from '@mantine/core';
import { useState } from 'react';
import { DevImages } from '@/pages/dev';

interface Props {
	images: {
		blurhash: string;
		src: string;
		height: number;
		width: number;
		blurDataURL: string;
	}[];
}

const useStyles = createStyles((theme) => ({
	smoothBlur: {
		// transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)',
		transition: 'all 700ms ease-in-out',
		overflow: 'hidden',
		filter: 'blur(40px)',
		grayscale: 'grayscale(1)',
		transform: 'scale(1.1)',

		':not(.isLoading)': {
			grayscale: 'grayscale(0)',
			filter: 'blur(0)',
			transform: 'scale(1)',
		},
	},
}));

function ImageComp({ image }: { image: IGetPlaiceholderReturn }) {
	const { classes, cx } = useStyles();
	const [isLoading, setLoading] = useState(true);

	return (
		<Carousel.Slide>
			<div
				style={{
					position: 'relative',
					width: '100%',
					height: 'auto',
					overflow: 'hidden',
				}}
			>
				{!isLoading && (
					<BlurhashCanvas
						hash={image.blurhash.hash}
						width={image.img.width}
						height={image.img.height}
						punch={1}
						style={{
							width: '100%',
							height: 'auto',
							position: 'absolute',
						}}
					/>
				)}
				<Image
					src={image.img.src}
					alt=""
					className={cx(
						classes.smoothBlur,
						...(isLoading ? ['isLoading'] : [])
					)}
					height={image.img.height}
					width={image.img.width}
					// fill
					style={{
						width: '100%',
						height: 'auto',
						// opacity: 0,
						objectFit: 'contain',
					}}
					onLoadingComplete={() => {
						setLoading(false);
					}}
				/>
			</div>
		</Carousel.Slide>
	);
}

export default function Test({ images }: { images: DevImages }) {
	const last5 = images.slice(-4);

	return (
		<Carousel withIndicators>
			{last5.map((image) => (
				<ImageComp image={image} key={image.blurhash.hash} />
			))}
		</Carousel>
	);
}
