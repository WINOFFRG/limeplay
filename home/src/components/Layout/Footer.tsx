import { useRouter } from 'next/router';
import { makeStyles } from '@/styles';
import { useCommonStyles } from '@/styles/common';
import { VariantLink } from '../Link';
import { Config } from '../../../config';

function Section({
	title,
	children = null,
}: {
	title: string;
	children?: React.ReactNode;
}) {
	const { classes, cx } = useStyles();

	return (
		<div className={classes.styledSection}>
			<h3 className={classes.sectionTitle}>{title}</h3>
			<ul className={classes.sectionList}>{children}</ul>
		</div>
	);
}

function FooterLink({
	href,
	children = null,
}: {
	href: string;
	children?: React.ReactNode;
}) {
	const router = useRouter();
	const { classes } = useStyles();

	const link = (() => (
		<VariantLink
			kind="dimmed"
			href={href}
			tab={!href.startsWith('/')}
			active={router.asPath.startsWith(href)}
		>
			{children}
		</VariantLink>
	))();

	return <li className={classes.sectionItem}>{link}</li>;
}

export function Footer() {
	const { classes, cx } = useStyles();
	const { classes: commonClasses } = useCommonStyles();

	return (
		<footer className={classes.footerWrapper}>
			<div className={cx(classes.inner, commonClasses.layoutContent)}>
				<div className={classes.leftContainer}>
					<div className={classes.logoWrapper}>
						Built by{' '}
						<VariantLink href={Config.AUTHOR_GITHUB}>
							Rohan Gupta{' '}
						</VariantLink>
						and{' '}
						<VariantLink
							href={`${Config.GITHUB_URL}/graphs/contributors`}
						>
							these awesome people
						</VariantLink>
					</div>
					<div
						className={classes.logoWrapper}
						style={{
							display: 'inline-block',
							fontWeight: 400,
							marginTop: '1rem',
						}}
					>
						This website is heavily inspired from{' '}
						<VariantLink href="https://linear.app">
							Linear{' '}
						</VariantLink>
						<br />
						&#10084; I am Developer <s>Designer</s> :)
					</div>
				</div>
				<Section title="About">
					<FooterLink href={Config.GITHUB_URL}>Contribute</FooterLink>
					<FooterLink href={`${Config.DOCS_BASE}about`}>
						About Limeplay
					</FooterLink>
					<FooterLink href={`${Config.DOCS_BASE}about`}>
						Changelog
					</FooterLink>
					<FooterLink href={`${Config.DOCS_BASE}about`}>
						Releases
					</FooterLink>
				</Section>
				<Section title="Community">
					<FooterLink href={Config.DISCORD_URL}>
						Chat on Discord
					</FooterLink>
					<FooterLink href={Config.AUTHOR_GITHUB}>
						Follow on Github
					</FooterLink>
					<FooterLink href={Config.AUTHOR_TWITTER}>
						Follow on Twitter
					</FooterLink>
					<FooterLink href={`${Config.GITHUB_URL}/issues`}>
						GitHub discussions
					</FooterLink>
				</Section>
				<Section title="Project">
					<FooterLink href="/">Limeplay UI</FooterLink>
					<FooterLink href={Config.DOCS_BASE}>
						Documentation
					</FooterLink>
					<FooterLink href={Config.NPM_URL}>
						npm organization
					</FooterLink>
				</Section>
			</div>
		</footer>
	);
}

const useStyles = makeStyles()((theme) => ({
	footerWrapper: {
		position: 'relative',
		maxWidth: '100%',
		zIndex: 'var(--layer-footer)',
		backdropFilter: 'blur(5px)',
		background: theme.color.pageBg,
		borderTop: '1px solid rgba(255, 255, 255, 0.1)',
	},

	inner: {
		display: 'flex',
		flexWrap: 'wrap',
		paddingTop: '56px',
		paddingBottom: '56px',
	},

	leftContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		marginRight: 'auto',
		gap: '3rem',

		[theme.breakpoints.max.laptop]: {
			width: '100%',
			flexDirection: 'row',
		},
	},

	logoWrapper: {
		display: 'flex',
		alignItems: 'center',
		whiteSpace: 'pre',
		color: theme.color.labelBase,
		fontSize: '14px',
		fontWeight: 500,
		lineHeight: '24px',
	},

	styledSection: {
		minWidth: 'min(180px, 100%)',

		[theme.breakpoints.max.laptop]: {
			minWidth: '50%',
			marginTop: '40px',
			flex: 1,
		},
	},

	sectionTitle: {
		fontSize: '14px',
		fontWeight: 500,
		lineHeight: '24px',
		color: theme.color.labelBase,
		marginBottom: '14px',
	},

	sectionList: {
		padding: 0,
		margin: 0,
	},

	sectionItem: {
		fontSize: '14px',
		listStyleType: 'none',
		margin: 0,

		'&:not(:last-child)': {
			marginBottom: '14px',
		},
	},
}));
