export default function BufferingLogo() {
    return (
        <div
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 100,
                top: 0,
                left: 0,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        width: "2rem",
                        height: "2rem",
                        border: "0.25rem solid rgba(255, 255, 255, 0.2)",
                        borderTopColor: "white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                    }}
                ></div>
                <div
                    style={{
                        marginTop: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                    }}
                ></div>
            </div>
        </div>
    );
}
