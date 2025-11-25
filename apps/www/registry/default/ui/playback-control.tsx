"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  MediaReadyState,
  usePlayer,
} from "@/registry/default/hooks/use-player";
import { useMediaStore } from "@/registry/default/ui/media-provider";

export type PlaybackControlPropsDocs = Pick<
  PlaybackControlProps,
  "shortcut" | "asChild"
>;

interface PlaybackControlProps extends React.ComponentProps<typeof Button> {
  /**
   * Keyboard shortcut hint displayed in aria-label
   * @example "Space"
   */
  shortcut?: string;
  /**
   * Render as child component using Radix Slot
   * @default false
   */
  asChild?: boolean;
}

export const PlaybackControl = React.forwardRef<
  HTMLButtonElement,
  PlaybackControlProps
>((props, forwardedRef) => {
  const status = useMediaStore((state) => state.status);
  const readyState = useMediaStore((state) => state.readyState);
  const { togglePaused } = usePlayer();

  const {
    children,
    onClick,
    disabled: userDisabled,
    "aria-label": ariaLabelProp,
    shortcut,
    asChild = false,
    ...restProps
  } = props;

  const Comp = asChild ? Slot : Button;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      togglePaused();
    }
  };

  const isDisabled =
    readyState < MediaReadyState.HAVE_CURRENT_DATA ||
    status === "buffering" ||
    userDisabled;

  const getDefaultAriaLabel = () => {
    const shortcutText = shortcut ? ` (keyboard shortcut ${shortcut})` : "";
    const labels = {
      ended: "Replay",
      playing: "Pause",
      default: "Play",
    };

    const label =
      status === "ended"
        ? labels.ended
        : status === "playing"
          ? labels.playing
          : labels.default;
    return `${label}${shortcutText}`;
  };

  return (
    <Comp
      aria-keyshortcuts={shortcut}
      aria-label={ariaLabelProp ?? getDefaultAriaLabel()}
      data-label="lp-playback-control"
      disabled={isDisabled}
      {...restProps}
      onClick={handleClick}
      ref={forwardedRef}
    >
      {children}
    </Comp>
  );
});

PlaybackControl.displayName = "PlaybackControl";
