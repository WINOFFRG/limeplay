import useStyles from './styles';

export default function PlaybackNotification({
	children,
}: {
	children: React.ReactNode;
}) {
	const { classes } = useStyles();

	return (
		<div className={`${classes.playbackNotification} `}>
			<div className={classes.playbackNotificationBackground} />
			<div className={classes.playbackNotificationIcon}>{children}</div>
		</div>
	);
}
