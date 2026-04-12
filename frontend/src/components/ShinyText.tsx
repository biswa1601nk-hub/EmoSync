
import { motion } from 'framer-motion';

export const ShinyText = ({ text }: { text: string }) => {
  return (
    <motion.span
      className="inline-block relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(100deg, #64CEFB 20%, #ffffff 50%, #64CEFB 80%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
      }}
      animate={{
        backgroundPosition: ['200% center', '-200% center'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {text}
    </motion.span>
  );
};
