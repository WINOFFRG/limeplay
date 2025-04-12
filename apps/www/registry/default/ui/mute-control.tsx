import React from "react";
import { Slot } from "@radix-ui/react-slot";

import { useVolumeStates } from "@/registry/default/hooks/use-volume-states";
import { useMediaStore } from "@/registry/default/ui/media-provider";

export interface MuteControlProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const MuteControl = React.forwardRef<
  HTMLButtonElement,
  MuteControlProps
>((props, forwardedRef) => {
  useVolumeStates();

  const Comp = props.asChild ? Slot : "button";
  const toggleMute = useMediaStore((state) => state.toggleMute);
  const muted = useMediaStore((state) => state.muted);
  const setMuted = useMediaStore((state) => state.setMuted);

  return (
    <Comp
      data-slot="mute-control"
      {...props}
      ref={forwardedRef}
      onClick={toggleMute}
    />
  );
});
