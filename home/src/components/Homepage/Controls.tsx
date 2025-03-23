import * as Collapsible from '@radix-ui/react-collapsible';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createStyles } from '@mantine/styles';
import { ChevronRightIcon } from '@/assets/icons/ChevronRightIcon';
import { ChevronDownIcon } from '@/assets/icons/ChevronDownIcon';
import { CTA, DimmedButton } from './Button';

interface ContainerProps {
	isHighlighted: boolean;
}

export function PlayerControls() {
	const [open, setOpen] = useState(false);
	const { classes, cx } = useStyles({
		isHighlighted: open,
	});

	return (
		<Collapsible.Root
			className={classes.collapsibleRoot}
			open={open}
			onOpenChange={setOpen}
		>
			<Collapsible.Trigger asChild>
				<div className={classes.contentWrapper}>
					<div className={classes.contentWrapper}>
						{open ? <ChevronDownIcon /> : <ChevronRightIcon />}
						<span>{open ? 'Hide' : 'Show'} Controls</span>
					</div>
					<Link href="/">v0.1.1</Link>
				</div>
			</Collapsible.Trigger>
			<Collapsible.Content
				style={{
					padding: '16px',
					gap: '8px',
					display: open ? 'flex' : 'none',
					flexDirection: 'column',
				}}
			>
				<motion.div
					key="content"
					initial="collapsed"
					animate="open"
					exit="collapsed"
					variants={{
						open: { opacity: 1, height: 'auto' },
						collapsed: { opacity: 0, height: 0 },
					}}
					transition={{
						duration: 0.8,
						ease: [0.04, 0.62, 0.23, 0.98],
					}}
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: '8px',
						}}
					>
						<input
							className={classes.inputField}
							type="text"
							id="Playback"
							defaultValue=""
							placeholder="Enter Playback URL"
						/>
						<DimmedButton>
							<span>Load</span>
						</DimmedButton>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: '8px',
						}}
					>
						{/* <Label.Root
						htmlFor="license"
						style={{
							fontWeight: 400,
							whiteSpace: 'nowrap',
						}}
					/> */}
						<input
							// className="Input"
							className={classes.inputField}
							type="text"
							id="license"
							defaultValue=""
							placeholder="Enter License URL"
						/>
						<DimmedButton>
							<span>Load</span>
						</DimmedButton>
					</div>
				</motion.div>
			</Collapsible.Content>
		</Collapsible.Root>
	);
}

const useStyles = createStyles((theme, { isHighlighted }: ContainerProps) => ({
	collapsibleRoot: {
		margin: '18px 0',
		borderRadius: '6px',
		overflow: 'hidden',
		backgroundColor: theme.other.color.bgShade,
		width: '100%',
		cursor: 'pointer',
		display: 'block',
		padding: '16px',
		border: '1px solid',
		borderColor: isHighlighted
			? theme.other.color.controlBaseHighlight
			: 'transparent',
		boxShadow: isHighlighted
			? '0px 0px 0px 3px rgba(94, 106, 210, 0.2)'
			: 'none',
		transition: 'background-color 0.2s, border-color 0.2s, box-shadow 0.2s',
		fontWeight: 600,
		fontSize: '16px',
		lineHeight: 1.5,
		color: theme.other.color.labelTitle,

		'.permalink-icon': {
			width: '12px',
			height: '12px',
			backgroundSize: 'cover',
			marginLeft: '8px',
			marginTop: '2px',
			transition: 'opacity 0.2s, color 0.2s',
			opacity: 0,
			visibility: 'hidden',
			display: 'inline-block',
			appearance: 'none',
			border: 'none',
			cursor: 'pointer',
			color: theme.other.color.labelMuted,

			svg: {
				width: '100%',
				height: '100%',
			},

			'&:hover': {
				color: theme.other.color.labelTitle,
			},
		},

		'&:hover': {
			backgroundColor: theme.other.color.bgSub,
			'.permalink-icon': {
				opacity: 1,
				visibility: 'visible',
			},
		},
	},

	contentWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		userSelect: 'none',
		gap: '4px',
	},

	inputField: {
		display: 'flex',
		width: '100%',
		alignItems: 'center',
		backgroundColor: theme.other.color.bgSub,
		border: `1px solid ${theme.other.color.bgBorder}`,
		color: theme.other.color.labelMuted,
		borderRadius: '6px',
		position: 'relative',
		height: '48px',
		fontSize: '1.4rem',
		padding: '0 16px',
		cursor: 'pointer',
		transition: '0.15s',
		transitionProperty: 'border-color, background, color',

		'@media screen and (max-width: 736px)': {
			fontSize: '16px',
			height: '40px',
			// borderRadius: 'var(--rounded-full)',
			padding: '0 24px',
		},

		'&:hover': {
			borderColor: theme.other.color.bgBorderSolid,
			backgroundColor: theme.other.color.bgBase,
			color: theme.other.color.labelTitle,
		},
	},
}));
