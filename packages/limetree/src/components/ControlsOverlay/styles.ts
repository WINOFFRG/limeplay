import { createStyles } from '@mantine/styles';

const useStyles = createStyles((theme) => ({
    skinControls: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },

    controlsWrapper: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition:
            'opacity .5s cubic-bezier(0.4,0,0.2,1) ,transform .2s cubic-bezier(0.4,0,0.2,1)',
    },

    controlsTopPanel: {
        height: 'auto',
        width: '100%',
        padding: `0 ${theme.spacing.xl}px`,
        paddingTop: theme.spacing.md,
        flex: `0 1 auto`,
        // backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.0001),rgba(0,0,0,.0156863) 8.62%,rgba(0,0,0,.0509804) 16.56%,rgba(0,0,0,.113725) 23.93%,rgba(0,0,0,.188235) 30.85%,rgba(0,0,0,.278431) 37.42%,rgba(0,0,0,.372549) 43.77%,rgba(0,0,0,.47451) 50%,rgba(0,0,0,.576471) 56.23%,rgba(0,0,0,.67451) 62.58%,rgba(0,0,0,.760784) 69.15%,rgba(0,0,0,.839216) 76.07%,rgba(0,0,0,.898039) 83.44%,rgba(0,0,0,.937255) 91.38%,rgba(0,0,0,.94902))`,
    },

    topRightSection: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    controlsMiddlePanel: {
        display: 'flex',
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    controlsBottomPanelWrapper: {
        display: 'flex',
        flexDirection: 'column',
        padding: `0 ${theme.spacing.xl}px`,
    },

    controlsBottomPanel: {
        // position: 'absolute',
        // bottom: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 'auto',
        width: '100%',
        paddingBottom: theme.spacing.md,
        flex: `0 1 auto`,
        backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.0001),rgba(0,0,0,.0156863) 8.62%,rgba(0,0,0,.0509804) 16.56%,rgba(0,0,0,.113725) 23.93%,rgba(0,0,0,.188235) 30.85%,rgba(0,0,0,.278431) 37.42%,rgba(0,0,0,.372549) 43.77%,rgba(0,0,0,.47451) 50%,rgba(0,0,0,.576471) 56.23%,rgba(0,0,0,.67451) 62.58%,rgba(0,0,0,.760784) 69.15%,rgba(0,0,0,.839216) 76.07%,rgba(0,0,0,.898039) 83.44%,rgba(0,0,0,.937255) 91.38%,rgba(0,0,0,.94902))`,
        // marginTop: '-400px',
    },

    centrePlaybackIcon: {
        background:
            'radial-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6) 77.5%, transparent 97.5%)',
        borderRadius: '50%',
        padding: '14px',
        margin: '0 auto',
        animation: 'zoom-and-fade-out 500ms ease-out',
        display: 'none',
    },

    iconAnimation: {
        '@keyframes zoom-and-fade-out': {
            '0%': {
                transform: 'scale(0)',
                opacity: 1,
                display: 'block',
            },
            '100%': {
                transform: 'scale(1.5)',
                opacity: 0,
                display: 'none',
            },
        },
    },
}));

export default useStyles;
