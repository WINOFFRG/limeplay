import {
	getPlaiceholder,
	IGetPlaiceholder,
	IGetPlaiceholderReturn,
} from 'plaiceholder';
import { GetStaticProps } from 'next';
import Test from '@/components/Test';
import { getAllUnsplashImagePaths } from '@/utils/get-all-images';

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const imagePaths = getAllUnsplashImagePaths() || [];

	console.log(params);

	const images = await Promise.all(
		imagePaths.map(async (src) => getPlaiceholder(src))
	).then((values) => values);

	return {
		props: {
			images,
		},
	};
};

const data = [
	{
		img: {
			src: '/images/hbomax_player_4.png',
			width: 1920,
			height: 961,
			type: 'png',
		},
		css: {
			backgroundImage:
				'linear-gradient(90deg, rgb(1,1,5) 25%,rgb(8,2,20) 25% 50%,rgb(9,0,23) 50% 75%,rgb(17,2,34) 75% 100%),linear-gradient(90deg, rgb(12,3,35) 25%,rgb(22,3,49) 25% 50%,rgb(29,4,47) 50% 75%,rgb(24,3,29) 75% 100%)',
			backgroundPosition: '0 0 ,0 100%',
			backgroundSize: '100% 50%',
			backgroundRepeat: 'no-repeat',
		},
		base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAI0lEQVR4nGNgYGCQEFPkZZGMDylmCPbLvbD94//P/3sqpwAAS5gJsGbpY58AAAAASUVORK5CYII=',
		blurhash: {
			width: 4,
			height: 2,
			hash: 'U01_.vomFA$n,}SbSass1VNm$SS7,}SbSass',
		},
		svg: [
			'svg',
			{
				xmlns: 'http://www.w3.org/2000/svg',
				width: '100%',
				height: '100%',
				shapeRendering: 'crispEdges',
				preserveAspectRatio: 'none',
				viewBox: '0 0 4 2',
				style: {
					position: 'absolute',
					top: '50%',
					left: '50%',
					transformOrigin: 'top left',
					transform: 'translate(-50%, -50%)',
					right: 0,
					bottom: 0,
				},
			},
			[
				[
					'rect',
					{
						fill: 'rgb(1,1,5)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 0,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(8,2,20)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 1,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(9,0,23)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 2,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(17,2,34)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 3,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(12,3,35)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 0,
						y: 1,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(22,3,49)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 1,
						y: 1,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(29,4,47)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 2,
						y: 1,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(24,3,29)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 3,
						y: 1,
					},
				],
			],
		],
	},
	{
		img: {
			src: '/images/hbomax_player_3.png',
			width: 1920,
			height: 961,
			type: 'png',
		},
		css: {
			backgroundImage:
				'linear-gradient(90deg, rgb(0,1,0) 25%,rgb(0,1,0) 25% 50%,rgb(0,0,0) 50% 75%,rgb(0,0,0) 75% 100%),linear-gradient(90deg, rgb(11,13,13) 25%,rgb(8,10,9) 25% 50%,rgb(1,0,0) 50% 75%,rgb(1,1,1) 75% 100%)',
			backgroundPosition: '0 0 ,0 100%',
			backgroundSize: '100% 50%',
			backgroundRepeat: 'no-repeat',
		},
		base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAHklEQVR4nGMQEBQQEBRggIBbd+7MnT+PjZVVVFQUADSZBR6S/DDPAAAAAElFTkSuQmCC',
		blurhash: {
			width: 4,
			height: 2,
			hash: 'U00SvCx[tRozfjfjfjfjIUM{RPV@fjfjfjfj',
		},
		svg: [
			'svg',
			{
				xmlns: 'http://www.w3.org/2000/svg',
				width: '100%',
				height: '100%',
				shapeRendering: 'crispEdges',
				preserveAspectRatio: 'none',
				viewBox: '0 0 4 2',
				style: {
					position: 'absolute',
					top: '50%',
					left: '50%',
					transformOrigin: 'top left',
					transform: 'translate(-50%, -50%)',
					right: 0,
					bottom: 0,
				},
			},
			[
				[
					'rect',
					{
						fill: 'rgb(0,1,0)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 0,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(0,1,0)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 1,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(0,0,0)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 2,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(0,0,0)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 3,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(11,13,13)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 0,
						y: 1,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(8,10,9)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 1,
						y: 1,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(1,0,0)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 2,
						y: 1,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(1,1,1)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 3,
						y: 1,
					},
				],
			],
		],
	},
	{
		img: {
			src: '/images/hbomax_player_2.png',
			width: 1920,
			height: 961,
			type: 'png',
		},
		css: {
			backgroundImage:
				'linear-gradient(90deg, rgb(0,0,0) 25%,rgb(0,0,0) 25% 50%,rgb(5,5,5) 50% 75%,rgb(9,9,9) 75% 100%),linear-gradient(90deg, rgb(0,0,0) 25%,rgb(0,0,0) 25% 50%,rgb(3,3,4) 50% 75%,rgb(9,9,10) 75% 100%)',
			backgroundPosition: '0 0 ,0 100%',
			backgroundSize: '100% 50%',
			backgroundRepeat: 'no-repeat',
		},
		base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAG0lEQVR4nGNgAIOcnJyzZ89C2AxOTs7nzp0HAEOiBt5zDVBZAAAAAElFTkSuQmCC',
		blurhash: {
			width: 4,
			height: 2,
			hash: 'U00cG#M{RjxuxuRjWBt7j@fRayfPxuRjWBt7',
		},
		svg: [
			'svg',
			{
				xmlns: 'http://www.w3.org/2000/svg',
				width: '100%',
				height: '100%',
				shapeRendering: 'crispEdges',
				preserveAspectRatio: 'none',
				viewBox: '0 0 4 2',
				style: {
					position: 'absolute',
					top: '50%',
					left: '50%',
					transformOrigin: 'top left',
					transform: 'translate(-50%, -50%)',
					right: 0,
					bottom: 0,
				},
			},
			[
				[
					'rect',
					{
						fill: 'rgb(0,0,0)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 0,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(0,0,0)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 1,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(5,5,5)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 2,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(9,9,9)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 3,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(0,0,0)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 0,
						y: 1,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(0,0,0)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 1,
						y: 1,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(3,3,4)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 2,
						y: 1,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(9,9,10)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 3,
						y: 1,
					},
				],
			],
		],
	},
	{
		img: {
			src: '/images/hbomax_player_1.png',
			width: 1920,
			height: 961,
			type: 'png',
		},
		css: {
			backgroundImage:
				'linear-gradient(90deg, rgb(1,1,1) 25%,rgb(0,0,0) 25% 50%,rgb(0,0,0) 50% 75%,rgb(0,0,0) 75% 100%),linear-gradient(90deg, rgb(3,3,3) 25%,rgb(0,0,0) 25% 50%,rgb(1,1,1) 50% 75%,rgb(0,0,0) 75% 100%)',
			backgroundPosition: '0 0 ,0 100%',
			backgroundSize: '100% 50%',
			backgroundRepeat: 'no-repeat',
		},
		base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAFklEQVR4nGNgZGRkgANmZmYGBgaIEAAA1AAQuOSaQgAAAABJRU5ErkJggg==',
		blurhash: {
			width: 4,
			height: 2,
			hash: 'U009jvofofofj[j[j[j[WBayayayj[j[j[j[',
		},
		svg: [
			'svg',
			{
				xmlns: 'http://www.w3.org/2000/svg',
				width: '100%',
				height: '100%',
				shapeRendering: 'crispEdges',
				preserveAspectRatio: 'none',
				viewBox: '0 0 4 2',
				style: {
					position: 'absolute',
					top: '50%',
					left: '50%',
					transformOrigin: 'top left',
					transform: 'translate(-50%, -50%)',
					right: 0,
					bottom: 0,
				},
			},
			[
				[
					'rect',
					{
						fill: 'rgb(1,1,1)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 0,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(0,0,0)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 1,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(0,0,0)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 2,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(0,0,0)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 3,
						y: 0,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(3,3,3)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 0,
						y: 1,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(0,0,0)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 1,
						y: 1,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(1,1,1)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 2,
						y: 1,
					},
				],
				[
					'rect',
					{
						fill: 'rgb(0,0,0)',
						fillOpacity: 1,
						width: 1,
						height: 1,
						x: 3,
						y: 1,
					},
				],
			],
		],
	},
];

export type DevImages = IGetPlaiceholderReturn[];

export function Dev(props) {
	console.log({ props });
	return <Test images={props.images ?? data} />;
}

export function Heading() {
	return <h1>Dev</h1>;
}
