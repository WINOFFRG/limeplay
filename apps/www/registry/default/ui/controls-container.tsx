import React from "react";

export function ControlsContainer({ children }: React.PropsWithChildren) {
  return (
    <div
      id="controls_wrapper"
      className="z-100 inset-0 isolate mt-6 min-h-16 rounded-xl bg-black contain-strict"
    >
      {children}
    </div>
  );
}
