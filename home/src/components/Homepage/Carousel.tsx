import { createStyles, keyframes } from '@mantine/styles';
import { Carousel } from '@mantine/carousel';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useMediaQuery, getHotkeyHandler } from '@mantine/hooks';
import { Flex, Text, UnstyledButton } from '@mantine/core';
import Image from 'next/image';
import css from 'styled-jsx/css';
import { useToggleClassname } from '@/hooks/useToggleClassname';
import { ChevronRightIcon } from '@/assets/icons/ChevronRightIcon';

const slidesData = [
	{
		title: 'Netflix',
		bg: `conic-gradient(
			from 45deg at 50% 50%,
			#FF0000 0deg,
			#B22222 45deg,
			#804040 90deg,
			#402020 135deg,
			#804040 180deg,
			#B22222 225deg,
			#FF0000 270deg,
			#804040 315deg
		  );`,
		image: '/themes/netflix_player_2.png',
		icon: '/themes/netflix_icon.svg',
	},
	{
		title: 'Hotstar',
		bg: `conic-gradient(
			from 45deg at 50% 50%,
			#69e6c4 0deg,
			#69e6c4 45deg,
			#365899 90deg,
			#365899 135deg,
			#69e6c4 180deg,
			#69e6c4 225deg,
			#365899 270deg,
			#365899 315deg
		  );`,
		image: '/themes/hotstar_player.png',
		icon: '/themes/hotstar_icon.svg',
	},
	{
		title: 'Prime Video',
		bg: 'conic-gradient(from 180deg at 50% 50%, rgb(255, 255, 255) -48.75deg, rgb(226, 238, 253) 35.62deg, rgb(66, 107, 246) 153.75deg, rgb(131, 194, 233) 232.5deg, rgb(255, 255, 255) 311.25deg, rgb(226, 238, 253) 395.63deg)',
		image: '/themes/prime_new_player.png',
		icon: '/themes/prime_icon.svg',
	},
	{
		title: 'Hulu',
		bg: 'conic-gradient(from 180deg at 50% 50%, rgb(255, 255, 255) -48.75deg, rgb(226, 238, 253) 35.62deg, rgb(66, 107, 246) 153.75deg, rgb(131, 194, 233) 232.5deg, rgb(255, 255, 255) 311.25deg, rgb(226, 238, 253) 395.63deg)',
		image: '/themes/hulu_new_player.png',
		icon: '/themes/hulu_icon.svg',
	},
	{
		title: 'Youtube',
		bg: 'conic-gradient(from 180deg at 50% 50%, rgb(255, 255, 255) -48.75deg, rgb(226, 238, 253) 35.62deg, rgb(66, 107, 246) 153.75deg, rgb(131, 194, 233) 232.5deg, rgb(255, 255, 255) 311.25deg, rgb(226, 238, 253) 395.63deg)',
		image: '/themes/youtubeo_player.png',
		icon: '/themes/youtube_icon.svg',
	},
];

type CarouselProps = {
	slides: typeof slidesData;
	slideIndex: number;
	setIndex: (index: number) => void;
};

type PaneProps = {
	active?: boolean;
	activate?: () => void;
	slide: (typeof slidesData)[0];
};

type ButtonProps = Pick<CarouselProps, 'slideIndex' | 'setIndex'> & {
	slides: typeof slidesData;
};

function Buttons({ slides, slideIndex, setIndex }: ButtonProps) {
	const [ref, toggle] = useToggleClassname<HTMLButtonElement>('animate');
	const [ref2, toggle2] = useToggleClassname<HTMLButtonElement>('animate');
	const { classes, cx } = useStyles({});

	return (
		<Flex align="center" justify="space-between" w="100%" pb="xs">
			<Flex gap={24} align="center">
				{slides.map((slide, index) => (
					<UnstyledButton
						className={cx(
							classes.textButton,
							...(slideIndex === index ? ['active'] : [])
						)}
						key={slide.title}
						onClick={() => setIndex(index)}
					>
						{slide.icon && (
							<Image src={slide.icon} height={36} width={36} />
						)}
						<Text size="md" fw={500}>
							{slide.title}
						</Text>
					</UnstyledButton>
				))}
			</Flex>
			<Flex gap={8}>
				<UnstyledButton
					className={classes.carouselButton}
					ref={ref}
					onClick={() => {
						toggle();

						if (slideIndex === 0) {
							setIndex(slides.length - 1);
						} else {
							setIndex(slideIndex - 1);
						}
					}}
					aria-label="Previous carousel item"
				>
					<ChevronRightIcon />
				</UnstyledButton>
				<UnstyledButton
					ref={ref2}
					className={classes.carouselButton}
					onClick={() => {
						toggle2();
						setIndex((slideIndex + 1) % slides.length);
					}}
					aria-label="Next carousel item"
				>
					<ChevronRightIcon />
				</UnstyledButton>
			</Flex>
		</Flex>
	);
}

export function Featured() {
	const [index, setIndex] = useState(0);
	const { classes } = useStyles({
		bg: slidesData[index].bg,
	});

	return (
		<>
			<div className={classes.fadedSeparator} />
			<div className={classes.featuredWrapper}>
				<div className={classes.wrapperBackground} />
				<ThemeCarousel
					slideIndex={index}
					setIndex={setIndex}
					slides={slidesData}
				/>
			</div>
		</>
	);
}

function Pane({ active, slide, activate }: PaneProps) {
	const { classes } = useStyles({
		bg: slide.bg,
		active,
	});

	return (
		<div className={classes.paneContiner}>
			<div
				className={classes.paneStyling}
				onClick={(e) => {
					if (!active) {
						e.preventDefault();
						activate?.();
					}
				}}
			>
				<div className={classes.paneBackground} />
				<div className={classes.paneImage}>
					<div className={classes.paneLayer}>
						<Image
							src={slide.image}
							height={480}
							width={960}
							alt={slide.title}
							style={
								{
									// objectFit: 'fill',
								}
							}
						/>
					</div>
				</div>
				{/* <div className={classes.paneOverlayBackground} /> */}
			</div>
		</div>
	);
}

export default function ThemeCarousel({
	slideIndex,
	slides,
	setIndex,
}: CarouselProps) {
	const { classes } = useStyles({});
	const scroller = useRef<HTMLDivElement>(null);
	const isMobile = useMediaQuery(`(max-width: 700px)`);

	function scrollTo(index: number) {
		if (scroller.current) {
			const { width } = scroller.current.getBoundingClientRect();

			scroller.current.scrollTo({
				left: index * width,
				top: 0,
				behavior: 'smooth',
			});
		}
	}

	function handleSetIndex(index: number) {
		if (isMobile) {
			scrollTo(index);
		} else {
			setIndex(index);
		}
	}

	function handleScroll(e: React.SyntheticEvent) {
		const el = e.target as HTMLElement;

		if (el) {
			const { scrollLeft } = el;
			const { width } = el.getBoundingClientRect();
			const item = Math.floor((scrollLeft - width / 2) / width) + 1;
			setIndex(item);
		}
	}

	return (
		<div className={classes.carouselWrapper}>
			<div className={classes.carouselPane} aria-live="polite">
				<div
					className={classes.carouselPaneInner}
					ref={scroller}
					style={{ ['--index' as string]: slideIndex }}
					onScroll={handleScroll}
				>
					{slides.map((slide, index) => (
						<Pane
							key={`featured-pane-${slide.title}`}
							active={slideIndex === index}
							slide={slide}
							activate={() => handleSetIndex(index)}
							aria-label={`${index + 1} of ${slides.length}`}
						/>
					))}
				</div>
			</div>
			<div className={classes.controlsWrapper}>
				<Buttons
					setIndex={setIndex}
					slideIndex={slideIndex}
					slides={slides}
				/>
			</div>
		</div>
	);
}

const useStyles = createStyles(
	(
		theme,
		{
			active,
			bg,
		}: {
			active?: boolean;
			bg?: string;
		}
	) => ({
		fadedSeparator: {
			background:
				'linear-gradient(var(--direction), transparent, rgba(255, 255, 255, 0.1) 50%, transparent)',
		},

		featuredWrapper: {
			position: 'relative',
			padding: '64px 0',
		},

		carouselWrapper: {
			width: '100%',
			position: 'relative',
			overflow: 'hidden',
		},

		wrapperBackground: {
			pointerEvents: 'none',
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			overflow: 'hidden',
			transition: 'opacity 0.3s ease-in-out',

			'&::before': {
				willChange: 'transform',
				content: '""',
				position: 'absolute',
				top: '20%',
				left: 0,
				right: 0,
				height: '100%',
				width: '100%',
				// transform: 'translateX(-50%)',
				opacity: 0.15,
				filter: 'blur(60px)',
				background:
					bg ??
					`conic-gradient(
      from 180deg at 58.33% 50%,
      #6d54e1 0deg,
      #ac8eff 7.5deg,
      #b59aff 125.63deg,
      #1ac8fc 243.75deg,
      #6d54e1 360deg
    )`,
			},

			'&::after': {
				content: '""',
				position: 'absolute',
				left: 0,
				right: 0,
				bottom: 0,
				top: '60%',
				background: `linear-gradient(to top, #000212, transparent)`,
			},
		},

		carouselPane: {
			willChange: 'scroll-position',
			width: '100%',
			height: '100%',
			marginTop: '40px',
			marginBottom: '56px',
		},

		carouselPaneInner: {
			position: 'relative',
			willChange: 'transform',
			display: 'flex',
			alignItems: 'flex-start',
			flexWrap: 'nowrap',
			width: '100%',
			'--pane-width': 'min(calc(100vw - 48px), 960px)',

			'--page-left': 'calc(50vw - (var(--pane-width) / 2))',
			left: 'calc(var(--page-left, 0px))',
			'--index-offset':
				'calc(-1 * var(--index) * (var(--pane-width) + 32px))',

			transform: 'translateX(var(--index-offset, 0px))',
			transition: 'transform 600ms',

			'& > * + *': {
				marginLeft: '32px',
			},

			'@media (max-width: 700px)': {
				left: '0',
				transform: 'none',
				'& > * + *': {
					marginLeft: '0',
				},
				overflowX: 'auto',
				overscrollBehaviorX: 'contain',
				scrollSnapType: 'x mandatory',
				'&::after': {
					content: '""',
					minWidth: 'var(--page-padding-right)',
					minHeight: '1px',
				},
			},
		},

		paneContiner: {
			perspective: '2880px',
			transformStyle: 'preserve-3d',
			display: 'flex',
			transition: '600ms',
			transitionProperty: 'transform',

			'&:hover': {
				transform: `scale(${active ? '1.02' : '1'})`,
			},

			'@media (max-width: 700px)': {
				transform: 'none',
				scrollSnapAlign: 'center',
				margin: '0 24px',
			},
		},

		paneStyling: {
			position: 'relative',
			cursor: 'pointer',
			userSelect: 'none',
			overflow: 'hidden',
			width: 'var(--pane-width)',
			height: 'calc(var(--pane-width) * 0.5)',
			flexShrink: 0,
			background: '#0f1012',
			borderRadius: 'calc(var(--pane-width) * 0.025)',
			border: '0.5px solid rgba(255, 255, 255, 0.15)',
			boxShadow: '0px 7px 32px rgba(0, 0, 0, 0.35)',

			willChange: 'transform',

			'--scale': active ? 1 : 0.9,
			opacity: active ? 1 : 0.3,
			'--pane-duration': '600ms',
			transform:
				'scale(var(--scale, 1)) rotateX(var(--x, 0deg)) rotateY(var(--y, 0deg))',
			transition: 'var(--pane-duration)',
			transitionProperty: 'transform, opacity',

			'&:hover': {
				'--pane-duration': '200ms',
			},

			'&:focus.focus-visible': {
				// boxShadow: `0 0 0 1px ${theme.color.controlBase}`,
			},

			'@media (max-width: 700px)': {
				height: '30vh',
				opacity: 1,
				'--scale': 1,
			},
		},

		paneBackground: {
			transform: 'translateZ(0)',
			zIndex: -1,

			pointerEvents: 'none',
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			filter: 'blur(60px)',
			opacity: 0.5,

			background:
				bg ??
				`conic-gradient(
    from 180deg at 58.33% 50%,
    #6d54e1 0deg,
    #ac8eff 7.5deg,
    #b59aff 125.63deg,
    #1ac8fc 243.75deg,
    #6d54e1 360deg
  )`,
		},

		paneImage: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			width: '100%',
			height: '100%',
			// maxWidth: '80%',
			// maxHeight: '80%',
			pointerEvents: 'none',

			'@media (max-width: 700px)': {
				transform: 'translate(-50%, 0)',
				top: '5%',
			},
		},

		paneLayer: {
			width: '100%',
			height: '100%',

			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',

			'& img': {
				maxWidth: '120%',
				maxHeight: '120%',
			},

			transformStyle: 'preserve-3d',
			position: 'relative',
			transition: 'transform var(--pane-duration)',
		},

		paneOverlayBackground: {
			pointerEvents: 'none',
			position: 'absolute',
			borderRadius: 'inherit',
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			transition: 'opacity var(--pane-duration)',
			background:
				'linear-gradient(to top, rgba(0, 0, 0, 0.7) 20%, rgba(0, 0, 0, 0.5) 40%, transparent 100%)',

			'@media (max-width: 700px)': {
				background:
					'linear-gradient(to top, rgba(0, 0, 0, 0.8) 20%, rgba(0, 0, 0, 0.6) 40%, transparent 100%)',
			},
		},
		controlsWrapper: {
			width: '100%',
			maxWidth: '1008px',
			margin: '0 auto',
			padding: '0 24px',
			position: 'relative',
			display: 'flex',
			alignItems: 'flex-start',
			flexDirection: 'column',
		},

		buttonsWrapper: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			width: '100%',
		},

		carouselButton: {
			borderRadius: '50%',
			background: '#2c2d3c',
			width: '32px',
			height: '32px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			color: '#858699',
			transition: 'background 120ms',
			'--fill-color': '#EEEFFC',
			'&:hover': {
				background: '#313248',
			},
			'&:first-child': {
				svg: {
					'--transform': 'rotate(180deg)',
				},
			},
			'&.animate': {
				svg: {
					animation: `${carouselButton} ease-in-out 250ms`,
				},
				'&:first-child': {
					'--transform-new': 'translateX(-2px) rotate(180deg)',
				},
				'&:last-child': {
					'--transform-new': 'translateX(2px)',
				},
			},
			'& svg': {
				transform: 'var(--transform, none)',
				transition: '120ms',
				transitionProperty: 'fill',
				fill: 'currentColor',
			},
		},

		textButton: {
			color: 'rgb(208, 214, 224)',
			userSelect: 'none',
			cursor: 'pointer',
			display: 'flex',
			alignItems: 'center',
			opacity: 0.6,
			transition: 'opacity 250ms',
			willChange: 'opacity',
			position: 'relative',
			gap: '4px',

			'&:hover': {
				opacity: 0.8,
			},

			'&.active': {
				opacity: 1,
			},

			'& img': {
				width: '24px',
			},
			height: '24x',

			'& span': {
				marginLeft: '6px',
			},

			'@media (max-width: 700px)': {
				'&:not(:first-child)': {
					marginLeft: '16px',
				},
				'& span': {
					display: 'none',
				},
			},
		},
	})
);

const carouselButton = keyframes`
  from, to {
    transform: var(--transform);
  }

  20%, 80% {
    fill: var(--fill-color);
  }

  50% {
    transform: var(--transform-new);
  }
`;
