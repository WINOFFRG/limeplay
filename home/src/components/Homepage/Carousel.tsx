import { createStyles, em, keyframes } from '@mantine/styles';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useMediaQuery, getHotkeyHandler } from '@mantine/hooks';
import { Box, Flex, Text, UnstyledButton } from '@mantine/core';
import Image from 'next/image';
import { useToggleClassname } from '@/hooks/useToggleClassname';
import { ChevronRightIcon } from '@/assets/icons/ChevronRightIcon';

import netflixPlayer from '../../../public/themes/netflix_player_2.png';
import hotstarPlayer from '../../../public/themes/hotstar_player.png';
import primePlayer from '../../../public/themes/prime_new_player.png';
import huluPlayer from '../../../public/themes/hulu_new_player.png';
import youtubePlayer from '../../../public/themes/youtubeo_player.png';

interface CarouselSlideProps {
	active?: boolean;
	bg?: string;
}

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
		image: netflixPlayer,
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
		image: hotstarPlayer,
		icon: '/themes/hotstar_icon.svg',
	},
	{
		title: 'Prime Video',
		bg: `conic-gradient(
			from 45deg at 50% 50%,
			#2888b9 0deg,
			#2170a6 45deg,
			#1a588d 90deg,
			#134074 135deg,
			#1a588d 180deg,
			#2170a6 225deg,
			#2888b9 270deg,
			#2170a6 315deg
		);`,
		image: primePlayer,
		icon: '/themes/prime_icon.svg',
	},
	{
		title: 'Hulu',
		bg: `conic-gradient(
			from 45deg at 50% 50%,
			#15ce65 0deg,
			#00a858 45deg,
			#007b47 90deg,
			#004e36 135deg,
			#007b47 180deg,
			#00a858 225deg,
			#15ce65 270deg,
			#00a858 315deg
		);`,
		image: huluPlayer,
		icon: '/themes/hulu_icon.svg',
	},
	{
		title: 'Youtube',
		bg: `conic-gradient(
			from 45deg at 50% 50%,
			#d90a19 0deg,
			#d90a19 45deg,
			#d90a19 90deg,
			#d90a19 135deg,
			#d90a19 180deg,
			#d90a19 225deg,
			#d90a19 270deg,
			#d90a19 315deg
		);`,
		image: youtubePlayer,
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
	ariaLabel?: string;
};

type ButtonProps = Pick<CarouselProps, 'slideIndex' | 'setIndex'> & {
	slides: typeof slidesData;
};

function Buttons({ slides, slideIndex, setIndex }: ButtonProps) {
	const [ref, toggle] = useToggleClassname<HTMLButtonElement>('animate');
	const [ref2, toggle2] = useToggleClassname<HTMLButtonElement>('animate');
	const { classes, cx } = useStyles({});
	const largeScreen = useMediaQuery('(min-width: 60em)');

	return (
		<Flex align="center" justify="space-between" w="100%" pt="1px" pb="1px">
			<Flex gap={largeScreen ? 24 : 18} align="center">
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
							<Image
								src={slide.icon}
								height={36}
								width={36}
								alt={slide.title}
							/>
						)}
						{largeScreen && (
							<Text size="md" fw={500}>
								{slide.title}
							</Text>
						)}
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
		<Box pos="relative" py="xl">
			<div className={classes.wrapperBackground} />
			<ThemeCarousel
				slideIndex={index}
				setIndex={setIndex}
				slides={slidesData}
			/>
		</Box>
	);
}

function Pane({ active, slide, activate, ariaLabel }: PaneProps) {
	const { classes } = useStyles({
		bg: slide.bg,
		active,
	});

	return (
		<div
			className={classes.paneContiner}
			aria-label={ariaLabel}
			data-active={active || undefined}
		>
			<div
				className={classes.paneStyling}
				onClick={(e) => {
					if (!active) {
						e.preventDefault();
						activate?.();
					}
				}}
				role="button"
				tabIndex={active ? 0 : -1}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						activate?.();
					}
				}}
			>
				<div className={classes.paneBackground} />
				<div className={classes.paneImage}>
					<div className={classes.paneLayer}>
						<Image
							src={slide.image}
							alt={slide.title}
							fill
							style={{
								objectFit: 'contain',
							}}
						/>
					</div>
				</div>
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
		<Box w="100%" pos="relative">
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
							ariaLabel={`${index + 1} of ${slides.length}`}
						/>
					))}
				</div>
			</div>
			<div className={classes.controlsWrapper}>
				<Buttons
					setIndex={(index: number) => {
						handleSetIndex(index);
					}}
					slideIndex={slideIndex}
					slides={slides}
				/>
			</div>
		</Box>
	);
}

const useStyles = createStyles((theme, { active, bg }: CarouselSlideProps) => ({
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
			top: '15%',
			left: '10%',
			right: '10%',
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
		marginTop: theme.spacing.xl,
		marginBottom: theme.spacing.xl,

		[theme.fn.smallerThan('md')]: {
			marginTop: theme.spacing.xs,
			marginBottom: theme.spacing.xs,
		},
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

		[`@media (max-width: ${em(700)})`]: {
			left: '0',
			paddingBottom: theme.spacing.xs,
			paddingTop: theme.spacing.xs,
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

			'-ms-overflow-style': 'none', // IE 10+
			overflow: '-moz-scrollbars-none', // Firefox
			scrollbarWidth: 'none', // Firefox

			'&::-webkit-scrollbar': {
				display: 'none',
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
		...theme.fn.focusStyles(),

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

		'@media (max-width: 700px)': {
			// height: '25vh', Commented bcoz started using Aspect Ratio
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

		[theme.fn.smallerThan('md')]: {
			transform: 'translate(-50%, 0)',
			top: '0',
		},
	},

	paneLayer: {
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		aspectRatio: '16 / 9',
		background: 'transparent',
	},

	controlsWrapper: {
		maxWidth: '1008px',
		margin: '0 auto',
		padding: '0 24px',
		position: 'relative',
		display: 'flex',
		alignItems: 'flex-start',
		flexDirection: 'column',
		overflow: 'hidden',
	},

	carouselButton: {
		borderRadius: theme.radius.xl,
		background: theme.other.color.bgBorder,
		width: em(32),
		height: em(32),
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: theme.other.color.labelMuted,
		transition: 'background 120ms',
		'--fill-color': theme.other.color.labelTitle,

		'&:hover': {
			background: theme.other.color.bgBorderSolid,
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

		[theme.fn.smallerThan('md')]: {
			width: em(24),
			height: em(24),
		},
	},

	textButton: {
		color: 'rgb(208, 214, 224)',
		userSelect: 'none',
		display: 'flex',
		alignItems: 'center',
		opacity: 0.6,
		transition: 'opacity 250ms',
		willChange: 'opacity',
		position: 'relative',
		gap: '4px',
		padding: em(4),
		borderRadius: em(4),

		'&:hover': {
			opacity: 0.8,
		},

		'&.active': {
			opacity: 1,
		},

		'& img': {
			width: '24px',
			height: '24x',
		},

		'& span': {
			marginLeft: '6px',
		},
	},
}));

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
