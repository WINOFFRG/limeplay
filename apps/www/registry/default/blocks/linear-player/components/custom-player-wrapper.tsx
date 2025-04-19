import * as motion from "motion/react-client";
import React from "react";

export function CustomPlayerWrapper({ children }: React.PropsWithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      {children}
    </motion.div>
  );
}
