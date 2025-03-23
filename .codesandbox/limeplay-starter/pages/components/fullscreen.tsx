import { useFullScreen, useOrientation } from "@limeplay/core";
import { CornersIn, CornersOut } from "@phosphor-icons/react";
import { useRef } from "react";
import { IconButton } from "./ui";

export default function FullscreenControl() {
	const elementRef = useRef(document.getElementById("limeplay-fs"));

	const { lockOrientation, unlockOrientation, orientation } = useOrientation({
		onError: (error) => {
			console.error("[limeplay] Handled Error:", error);
		},
		onChange: (event) => {
			if (orientation.type.includes("landscape") && !isFullScreen) {
				enterFullScreen();
			} else if (orientation.type.includes("portrait") && isFullScreen) {
				exitFullScreen();
			}
		},
	});

	const {
		isFullScreen,
		toggleFullScreen,
		isFullScreenSupported,
		enterFullScreen,
		exitFullScreen,
	} = useFullScreen({
		elementRef,
		onEnter: () => {
			lockOrientation("landscape");
		},
		onExit: unlockOrientation,
		onError: (error) => {
			console.error("[limeplay] Handled Error:", error);
		},
	});

	if (!isFullScreenSupported) return null;

	return (
		<IconButton
			onClick={toggleFullScreen}
			aria-label={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
		>
			{!isFullScreen ? (
				<CornersOut className='action-icon' />
			) : (
				<CornersIn className='action-icon' />
			)}
		</IconButton>
	);
}
