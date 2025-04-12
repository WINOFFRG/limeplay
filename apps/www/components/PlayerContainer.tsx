import { motion } from "motion/react";

export function PlayerContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        transform: "translate(-50%, -49%) scale(0.95)",
        scale: 0
      }}
      animate={{
        opacity: 1,
        transform: "translate(-50%, -50%)",
        scale: 1
      }}
      transition={{
        scale: {
          type: "spring",
          visualDuration: 0.9,
          stiffness: 100
        },
        opacity: {
          type: "ease",
          duration: 0.4
        }
      }}
      className="z-100 fixed left-1/2 top-1/2 max-h-[calc(100vh-24px-24px)] w-screen max-w-[calc(100vw-var(--page-padding-left)-var(--page-padding-right))]"
    >
      {children}
    </motion.div>
  );
}
