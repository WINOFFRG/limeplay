import { useMediaStore } from "@/registry/default/ui/media-provider";
import { useEffect } from "react";
import { off, on } from "@/registry/default/lib/utils";

export function useTimelineStates() {
  const mediaRef = useMediaStore((state) => state.mediaRef);
  const duration = useMediaStore((state) => state.duration);
  const setDuration = useMediaStore((state) => state.setDuration);
  const currentTime = useMediaStore((state) => state.currentTime);
  const setCurrentTime = useMediaStore((state) => state.setCurrentTime);

  useEffect(() => {
    if (mediaRef && mediaRef.current) {
      const updatedCurrentTime = (
        event: React.SyntheticEvent<HTMLVideoElement, Event>
      ) => {
        console.log("native time :: ", event.currentTarget.currentTime);
        setCurrentTime(event.currentTarget.currentTime);
      };

      const updateDuration = (
        event: React.SyntheticEvent<HTMLVideoElement, Event>
      ) => {
        setDuration(event.currentTarget.duration);
      };

      if (mediaRef.current.readyState >= 2) {
        console.log("Setting Duration to :: ", mediaRef.current.duration);
        setDuration(mediaRef.current.duration);
        return;
      } else {
        console.warn(
          "Didnt set duration because :: ",
          mediaRef.current.readyState
        );
      }

      on(mediaRef.current, "timeupdate", updatedCurrentTime);
      on(
        mediaRef.current,
        ["canplay", "canplaythrough", "durationchange"],
        updateDuration
      );

      return () => {
        const mediaElement = mediaRef.current;
        if (mediaElement) {
          off(mediaElement, "timeupdate", updatedCurrentTime);
          off(
            mediaElement,
            ["canplay", "canplaythrough", "durationchange"],
            updateDuration
          );
        }
      };
    }
  }, [mediaRef]);
}
