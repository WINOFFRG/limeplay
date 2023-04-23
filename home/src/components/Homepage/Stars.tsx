import { useInView, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { random, uniqueId } from 'lodash';
import { keyframes } from 'tss-react';
import { makeStyles } from '@/styles';
import { fadeIn } from '@/styles/animation';
import { gradientBorder } from '@/styles/mixins';

interface Star {
	id: string;
	size: number;
	orientation: 'horizontal' | 'vertical';
	duration: number;
}

export function Stars({
	parentRef: ref,
}: {
	parentRef: React.RefObject<HTMLDivElement>;
}) {
	const { classes } = useStyles();
	const animate = useInView(ref, { amount: 'some' });
	const reduceMotion = useReducedMotion();
	const [stars, setStars] = useState<Star[]>([]);

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		function generateStar() {
			timeout = setTimeout(generateStar, random(500, 2000));

			const id = uniqueId();
			setStars((existing) => [
				...existing,
				{
					id,
					size: random(60, 180),
					orientation:
						Math.random() > 0.5 ? 'horizontal' : 'vertical',
					duration: random(600, 2000),
				},
			]);
		}

		if (!reduceMotion && animate) {
			generateStar();
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [animate, reduceMotion]);

	return (
		<div className={classes.placeholder}>
			{stars.map((star) => (
				<div
					className={classes.stars}
					key={star.id}
					data-orientation={star.orientation}
					style={{
						['--size' as string]: star.size,
						['--duration' as string]: star.duration,
					}}
					onAnimationEnd={() => {
						setStars((existing) =>
							existing.filter((s) => s.id !== star.id)
						);
					}}
				/>
			))}
		</div>
	);
}

const useStyles = makeStyles()((theme) => ({
	placeholder: {
		height: '600px',

		position: 'relative',
		overflow: 'hidden',
		backgroundColor: 'rgba(255, 255, 255, 0.01)',
		backgroundImage:
			'radial-gradient(ellipse 50% 80% at 20% 40%, rgba(93, 52, 221, 0.1), var(--transparent)), ' +
			'radial-gradient(ellipse 50% 80% at 80% 50%, rgba(120, 119, 198, 0.15), var(--transparent))',
		...gradientBorder(
			1,
			'linear-gradient(to bottom, rgba(95, 106, 210, 0.2), var(--transparent))'
		),
		borderRadius: 'var(--radius)',
		animation: `${fadeIn()} var(--base-delay) forwards`,

		'&::after': {
			content: '""',
			position: 'absolute',
			inset: 0,
			opacity: 0,
			transition: 'opacity 480ms',

			':root': {
				'--alpha': '0.3',
			},

			backgroundImage:
				'radial-gradient(ellipse 50px 20px at 46% 0%, rgba(74, 101, 199, var(--alpha)), var(--transparent)), ' +
				'radial-gradient(ellipse 50px 20px at 50% 0%, rgba(95, 75, 218, var(--alpha)), var(--transparent)), ' +
				'radial-gradient(ellipse 50px 20px at 54% 0%, rgba(91, 45, 221, var(--alpha)), var(--transparent))',
		},
	},

	stars: {
		position: 'absolute',
		borderRadius: '2px',
		background:
			'linear-gradient(var(--direction), #9d9bf2 0.43%, #7877c6 14.11%, rgba(120, 119, 198, 0) 62.95%)',
		zIndex: 1,
		opacity: 0,

		"&[data-orientation='vertical']": {
			'--direction': 'to top',
			top: 'calc(1% * var(--start))',
			right: 0,
			width: '1px',
			height: 'calc(1px * var(--size))',
			animation: `${starVertical} calc(var(--duration) * 1ms) linear forwards`,
			animationDelay: 'calc(var(--base-delay) + 400ms)',
		},

		"&[data-orientation='horizontal']": {
			'--direction': 'to left',
			height: '1px',
			top: 0,
			left: 'calc(1% * var(--start))',
			width: 'calc(1px * var(--size))',
			animation: `${starHorizontal} calc(var(--duration) * 1ms) linear forwards`,
			animationDelay: 'calc(var(--base-delay) + 400ms)',
		},
	},
}));

const starHorizontal = keyframes`
  from {
    opacity: 0;
    transform: translateX(0);
  }

  20% {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translateX(800px);
  }
`;

const starVertical = keyframes`
  from {
    opacity: 0;
    transform: translateY(0px);
  }

  20% {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translateY(300px);
  }
`;
