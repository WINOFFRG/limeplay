import { createStyles } from '@mantine/styles';

const useStyles = createStyles((theme, _params, getRef) => ({
    timelineWrrapper: {
        display: 'flex',
        flexDirection: 'row',
        padding: `0 ${theme.spacing.md}px`,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.sm,
    },

    timelineSlider__Continer: {
        width: '100%',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',

        [`&:hover .${getRef('timelineSlider__ProgressBar')}`]: {
            height: '6px',
            borderRadius: '6px',
        },

        [`&:hover .${getRef('timelineSlider__DurationBar')}`]: {
            height: '6px',
            borderRadius: '6px',
        },

        [`&:hover .${getRef('timelineSlider__PlayHead')}`]: {
            transform: 'scale(1.5) translateX(-50%)',
        },
    },

    timelineSlider: {
        display: 'flex',
        height: '36px',
        width: '100%',
        alignItems: 'center',
    },

    timelineSlider__ProgressBar: {
        ref: getRef('timelineSlider__ProgressBar'),
        position: 'absolute',
        height: '4px',
        width: '100%',
        borderRadius: '2px',
        transition: 'height border-radius 0.2s ease-in-out',
    },

    timelineSlider__DurationBar: {
        ref: getRef('timelineSlider__DurationBar'),
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: '#808080',
        borderRadius: '2px',
        transition: 'height border-radius 0.2s ease-in-out',
    },

    timelineSlider__DurationPlayed: {
        ref: getRef('timelineSlider__DurationPlayed'),
        position: 'absolute',
        height: '100%',
        backgroundColor: theme.colors.gray[2],
        borderRadius: '2px',
        transition: 'transform 0.2s ease-in-out',
    },

    timelineSlider__PlayHead: {
        ...theme.fn.focusStyles(),

        ref: getRef('timelineSlider__PlayHead'),
        position: 'absolute',
        height: '12px',
        width: '12px',
        borderRadius: '50%',
        backgroundColor: theme.white,
        transform: 'translateX(-50%)',
        transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)',
        transformOrigin: 'left',
        zIndex: 1,
        cursor: 'grab',
    },

    timelineSlider__VerticalBar__Hover: {
        position: 'absolute',
        height: '16px',
        width: '4px',
        backgroundColor: theme.white,
        borderRadius: '2px',
        transform: 'translate(-50%)',
        // transition: 'all 0.2s ease-in-out',
    },

    timelineSlider__VerticalBarDuration__Hover: {
        position: 'absolute',
        // height: '16px',
        // width: '4px',
        padding: '0 8px',
        backgroundColor: theme.colors.dark[7],
        color: theme.white,
        borderRadius: '2px',
        transform: 'translateX(-50%) translateY(-120%)',
    },

    controlButton: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '44px',
        height: '44px',
        opacity: 0.7,
        transition: 'opacity 0.1s ease-in-out',
        backgroundColor: 'transparent',
        border: 'none',

        '&:hover': {
            opacity: 1,
            cursor: 'pointer',
            transform: 'scale(1.1)',
        },

        '&:disabled': {
            opacity: 0.3,
            cursor: 'not-allowed',
            transform: 'none',
        },
    },

    iconStyle: {
        width: '24px',
        height: '24px',
        margin: 'auto',
        pointerEvents: 'none',
    },
}));

export default useStyles;
