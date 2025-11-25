import React from "react";

export type OrientationType =
  | "landscape-primary"
  | "landscape-secondary"
  | "portrait-primary"
  | "portrait-secondary"
  | "UNKNOWN";

export type OrientationState = {
  angle: number;
  type: OrientationType;
  isPortrait: boolean;
  isLandscape: boolean;
};

export function useOrientation(): OrientationState {
  const [orientation, setOrientation] = React.useState<OrientationState>({
    angle: 0,
    type: "UNKNOWN",
    isPortrait: false,
    isLandscape: false,
  });

  React.useLayoutEffect(() => {
    const updateOrientation = () => {
      let newOrientation: OrientationState;

      if ("orientation" in window.screen) {
        const { angle, type } = window.screen.orientation;
        newOrientation = {
          angle,
          type: type as OrientationType,
          isPortrait: type.includes("portrait"),
          isLandscape: type.includes("landscape"),
        };
      } else {
        const isPortrait = window.innerHeight > window.innerWidth;
        newOrientation = {
          angle: 0,
          type: isPortrait ? "portrait-primary" : "landscape-primary",
          isPortrait,
          isLandscape: !isPortrait,
        };
      }

      setOrientation(newOrientation);
    };

    // Initial orientation check
    updateOrientation();

    // Event listeners for orientation changes
    const handleOrientationChange = () => {
      updateOrientation();
    };

    const handleResize = () => {
      // Debounce resize events to avoid excessive updates
      setTimeout(updateOrientation, 100);
    };

    // Add event listeners
    if (typeof window !== "undefined") {
      if ("orientation" in window.screen) {
        window.screen.orientation.addEventListener(
          "change",
          handleOrientationChange
        );
      } else {
        window.addEventListener("orientationchange", handleOrientationChange);
      }

      window.addEventListener("resize", handleResize);
    }

    // Cleanup
    return () => {
      if (typeof window !== "undefined") {
        if ("orientation" in window.screen) {
          window.screen.orientation.removeEventListener(
            "change",
            handleOrientationChange
          );
        } else {
          window.removeEventListener(
            "orientationchange",
            handleOrientationChange
          );
        }

        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return orientation;
}
