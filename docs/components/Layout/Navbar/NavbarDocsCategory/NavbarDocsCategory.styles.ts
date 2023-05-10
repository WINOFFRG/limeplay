import { createStyles } from '@mantine/core';

export default createStyles((theme, collapsed: boolean) => ({
	category: {
		marginBottom: `calc(${theme.spacing.xl} * 1.2)`,
	},

	categoryCollapsed: {
		marginBottom: 0,
	},

	header: {
		...theme.fn.focusStyles(),
		backgroundColor: 'transparent',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: `calc(100% + ${theme.spacing.md}px)`,
		color:
			theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[7],
		height: 32,
		border: 0,
		padding: `0 ${theme.spacing.md}`,
		paddingLeft: 0,
		cursor: 'pointer',
	},

	icon: {
		width: 15,
		height: 15,
		marginRight: theme.spacing.md,
		transform: 'rotate(0deg)',
		transition: 'transform 150ms ease',
	},

	iconCollapsed: {
		transform: 'rotate(90deg)',
		transition: 'transform 150ms ease',
	},

	innerCategory: {
		// paddingTop: '0.25rem',
		paddingLeft: 0,
	},

	innerCategoryIcon: {
		marginRight: 10,
		width: 14,
		height: 14,
	},

	innerCategoryTitle: {
		position: 'relative',
		paddingLeft: '0.5rem',
		// marginLeft: 7,
		marginBottom: 5,
		// borderLeft: `1px solid ${
		//     theme.colorScheme === 'dark'
		//         ? theme.colors.dark[6]
		//         : theme.colors.gray[3]
		// }`,
		height: 34,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		fontSize: theme.fontSizes.sm,
		// backgroundColor:
		//     theme.colorScheme === 'dark'
		//         ? theme.colors.dark[7]
		//         : theme.colors.gray[0],
		color:
			theme.colorScheme === 'dark'
				? theme.colors.dark[2]
				: theme.colors.gray[6],
		borderRadius: theme.radius.sm,
		// borderTopRightRadius: theme.radius.sm,
		// borderBottomRightRadius: theme.radius.sm,

		// '&::after': {
		//     content: '""',
		//     position: 'absolute',
		//     bottom: -5,
		//     left: -1,
		//     height: 5,
		//     width: 1,
		//     backgroundColor:
		//         theme.colorScheme === 'dark'
		//             ? theme.colors.dark[6]
		//             : theme.colors.gray[3],
		// },

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark'
					? 'hsl(204deg 100% 94%/.05)'
					: theme.colors.gray[0],
			color: 'white',
		},
	},

	link: {
		...theme.fn.focusStyles(),
		WebkitTapHighlightColor: 'transparent',
		// borderLeft: `1px solid ${
		//     theme.colorScheme === 'dark'
		//         ? theme.colors.dark[6]
		//         : theme.colors.gray[3]
		// }`,
		outline: 0,
		display: 'block',
		textDecoration: 'none',
		borderRadius: theme.radius.sm,
		color:
			theme.colorScheme === 'dark'
				? theme.colors.dark[2]
				: theme.colors.gray[7],
		// paddingLeft: 23,
		paddingLeft: '0.5rem',
		paddingRight: theme.spacing.md,
		marginLeft: 7,
		height: 34,
		lineHeight: '34px',
		// borderTopRightRadius: theme.radius.sm,
		// borderBottomRightRadius: theme.radius.sm,
		fontSize: theme.fontSizes.sm,
		userSelect: 'none',
		transition: 'all 150ms ease',

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark'
					? 'hsl(204deg 100% 94%/.05)'
					: theme.colors.gray[0],
			color: 'white',
		},
	},

	rootWrapper: {
		position: 'relative',
		// paddingLeft: '0.75rem',
		// marginLeft: '0.25rem',
		display: 'flex',
		// gap: theme.spacing.xs,
		flexDirection: 'column',

		// '&:before': {
		//     content: '""',
		//     backgroundColor: 'rgba(38,38,38,1)',
		//     position: 'absolute',
		//     top: 0,
		//     left: 0,
		//     width: 1,
		//     height: '100%',
		// },
	},

	listWrapper: {
		position: 'relative',
		marginLeft: '0.25rem',
		display: 'flex',
		gap: theme.spacing.xs,
		flexDirection: 'column',

		'&:before': {
			content: '""',
			marginLeft: '0.50rem',
			backgroundColor: 'rgba(38,38,38,1)',
			position: 'absolute',
			top: 0,
			left: 0,
			width: 1,
			height: '100%',
		},
	},

	linkActive: {
		// borderLeftColor: theme.colors.blue[7],
		backgroundColor:
			theme.colorScheme === 'dark'
				? 'hsl(204deg 100% 50%/.1)'
				: theme.colors.blue[0],
		fontWeight: 500,
		color: 'hsl(204deg 100% 45%/1)',

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark'
					? 'hsl(204deg 100% 50%/.1)'
					: theme.colors.blue[0],
			color: 'hsl(204deg 100% 45%/1)',
		},
	},

	title: {
		userSelect: 'none',
		fontWeight: 700,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		lineHeight: 1,
		paddingTop: 4,
		color:
			theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[7],
		letterSpacing: 0.5,
		wordSpacing: 1,

		paddingLeft: '0.5rem',
		marginLeft: 7,
		marginBottom: 5,
	},

	blueLinkActive: {
		padding: collapsed ? '0' : '0.5rem',
		paddingRight: 0,
		maxHeight: collapsed ? 0 : 1000,
		overflow: 'hidden',
		transition: 'all 250ms ease-in-out',
		transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)',
		opacity: collapsed ? 0 : 1,
	},

	linkWrapper: {
		display: collapsed ? 'none' : 'block',
		padding: collapsed ? '0' : '0.5rem',
		paddingRight: 0,
		paddingLeft: 0,
		maxHeight: collapsed ? 0 : 1000,
		overflow: 'hidden',
		transition: 'all 250ms ease-in-out',
		transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)',
		opacity: collapsed ? 0 : 1,
	},
}));
