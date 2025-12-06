import React from "react"

export interface OrientationState {
  angle: number
  isLandscape: boolean
  isPortrait: boolean
  type: OrientationType
}

export type OrientationType =
  | "landscape-primary"
  | "landscape-secondary"
  | "portrait-primary"
  | "portrait-secondary"
  | "UNKNOWN"

export function useOrientation(): OrientationState {
  const [orientation, setOrientation] = React.useState<OrientationState>({
    angle: 0,
    isLandscape: false,
    isPortrait: false,
    type: "UNKNOWN",
  })

  React.useLayoutEffect(() => {
    const updateOrientation = () => {
      let newOrientation: OrientationState

      if ("orientation" in window.screen) {
        const { angle, type } = window.screen.orientation
        newOrientation = {
          angle,
          isLandscape: type.includes("landscape"),
          isPortrait: type.includes("portrait"),
          type: type as OrientationType,
        }
      } else {
        const isPortrait = window.innerHeight > window.innerWidth
        newOrientation = {
          angle: 0,
          isLandscape: !isPortrait,
          isPortrait,
          type: isPortrait ? "portrait-primary" : "landscape-primary",
        }
      }

      setOrientation(newOrientation)
    }

    // Initial orientation check
    updateOrientation()

    // Event listeners for orientation changes
    const handleOrientationChange = () => {
      updateOrientation()
    }

    const handleResize = () => {
      // Debounce resize events to avoid excessive updates
      setTimeout(updateOrientation, 100)
    }

    // Add event listeners
    if (typeof window !== "undefined") {
      if ("orientation" in window.screen) {
        window.screen.orientation.addEventListener(
          "change",
          handleOrientationChange
        )
      } else {
        window.addEventListener("orientationchange", handleOrientationChange)
      }

      window.addEventListener("resize", handleResize)
    }

    // Cleanup
    return () => {
      if (typeof window !== "undefined") {
        if ("orientation" in window.screen) {
          window.screen.orientation.removeEventListener(
            "change",
            handleOrientationChange
          )
        } else {
          window.removeEventListener(
            "orientationchange",
            handleOrientationChange
          )
        }

        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  return orientation
}
