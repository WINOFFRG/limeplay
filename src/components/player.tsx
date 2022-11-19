import * as React from "react";

const ReactShakaPlayer = ({ uiContainerRef }: { uiContainerRef: any }) => {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "black",
            }}
        >
            <video
                style={{
                    width: "100vw",
                    height: "100vh",
                    pointerEvents: "none",
                    // zIndex: 0,
                }}
                playsInline={true}
                ref={uiContainerRef}
                muted={false}
                autoPlay={false}
                controls={false}
            />
        </div>
    );
};

export { ReactShakaPlayer };
