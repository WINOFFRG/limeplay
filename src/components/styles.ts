const styles: any = {
    mainPlayerWrapper: {
        position: "relative",
        width: "100vw",
        height: "100vh",
        maxWidth: "100%",
        maxHeight: "100%",
    },

    playerOverlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        zIndex: 100,
    },

    playerOverlayWrapper: {
        position: "absolute",
        left: 0,
        paddingLeft: "1rem",
        paddingRight: "1rem",
        marginBottom: "1.5rem",
        bottom: 0,
        opacity: 0.7,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
    },

    playPauseIcon: {
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        outline: "none",
        zIndex: 100,
    },

    liveIcon: {
        border: "none",
        cursor: "pointer",
        outline: "none",
        zIndex: 100,
        color: "red",
    },

    timeIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
    },
};

export default styles;
