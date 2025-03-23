import { Text, Title, createStyles, em } from '@mantine/core';
import LayoutContent from '../Layout/LayoutContent';

const useStyles = createStyles((theme) => ({
	titleWrapper: {
		userSelect: 'none',
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'center',
		overflow: 'visible',
		padding: em(32),
		marginLeft: 'calc(-1 * var(--page-padding-left))',
		marginRight: 'calc(-1 * var(--page-padding-right))',

		':before': {
			content: '""',
			pointerEvents: 'none',
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%) translateZ(0)',
			height: '256px',
			width: '256px',
			background:
				'linear-gradient(180deg, rgba(108, 56, 255, 0.8) 0%, rgba(181, 154, 255, 0.8) 100%)',
			opacity: 0.4,
			borderRadius: '50%',
			filter: 'blur(80px)',
			overflow: 'visible',
			animation: 'gradient 800ms 800ms both',
			zIndex: 1,
		},
	},
}));

export default function Themes() {
	const { classes } = useStyles();

	return (
		<LayoutContent>
			<div className={classes.titleWrapper}>
				<Title
					order={4}
					variant="gradient"
					gradient={{
						from: '#6C38FF',
						to: '#B59AFF',
						deg: 90,
					}}
					fw={600}
					lh={1.6}
					lts="0.2em"
					align="center"
					mt="md"
					tt="uppercase"
				>
					Themes
				</Title>
				<Title
					order={1}
					fw={600}
					align="center"
					mb="sm"
					lh={1.2}
					lts="-0.022px"
				>
					Dozens of Components! Endless possibilities.
				</Title>
				<Text
					color="rgb(138, 143, 152)"
					align="center"
					size="md"
					lh={1.6}
					fw={400}
					lts="-0.014px"
					style={{ fontSize: '18px' }}
				>
					Create stunning Video Player with highly customizable
					Components & Hooks
					<br /> Completly Accessible, Compatible & Modern
				</Text>
			</div>
		</LayoutContent>
	);
}
