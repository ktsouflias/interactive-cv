import { motion } from "framer-motion";

export default function MotionSection({ children, delay = 0, className = "" }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
