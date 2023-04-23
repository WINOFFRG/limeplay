import useStyles from '../styles';

export function QualityIcon() {
	const { classes } = useStyles();

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1.125rem"
			height="1.125rem"
			viewBox="0 0 24 24"
			fill="#FFF"
			stroke="#FFF"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={classes.iconStyle}
		>
			<path d="M6 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
			<path d="M6 4l0 4" />
			<path d="M6 12l0 8" />
			<path d="M12 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
			<path d="M12 4l0 10" />
			<path d="M12 18l0 2" />
			<path d="M18 7m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
			<path d="M18 4l0 1" />
			<path d="M18 9l0 11" />
		</svg>
	);
}

export default function QualityControl() {
	const { classes } = useStyles();

	const qualityValues = [
		{
			name: 'Low',
			tag: 'Data Saver',
			isActive: false,
		},
		{
			name: 'HD',
			tag: 'Upto 720p',
			isActive: false,
		},
		{
			name: 'Full HD',
			tag: 'Upto 1080p',
			isActive: true,
		},
	];

	return null;

	// return (
	// 	<Popover
	// 		width={200}
	// 		withArrow
	// 		arrowOffset={15}
	// 		arrowSize={10}
	// 		position="bottom"
	// 		opened={!opened}
	// 		offset={5}
	// 	>
	// 		<Popover.Target>
	// 			<UnstyledButton
	// 				className={classes.controlButton}
	// 				onMouseEnter={open}
	// 				onMouseLeave={close}
	// 			>
	// 				<QualityIcon />
	// 			</UnstyledButton>
	// 		</Popover.Target>
	// 		<Popover.Dropdown className={classes.qualitywrapper}>
	// 			<div className={classes.qualityContainer}>
	// 				<div className={classes.qualityValues}>
	// 					{qualityValues.map((value) => (
	// 						<div className={classes.qualityItem}>
	// 							<div
	// 								style={{
	// 									display: 'flex',
	// 									alignItems: 'center',
	// 									flexDirection: 'row',
	// 								}}
	// 							>
	// 								{/* {value.isActive && <>✅</>} */}
	// 								<UnstyledButton>
	// 									<Text
	// 										size="sm"
	// 										weight="400"
	// 										// className={classes.qualityName}
	// 										color="white"
	// 									>
	// 										{value.name}
	// 									</Text>
	// 								</UnstyledButton>
	// 							</div>
	// 							<Text
	// 								size="xs"
	// 								// className={classes.qualityTag}
	// 							>
	// 								{value.tag}
	// 							</Text>
	// 						</div>
	// 					))}
	// 				</div>
	// 			</div>
	// 		</Popover.Dropdown>
	// 	</Popover>
	// );
}
