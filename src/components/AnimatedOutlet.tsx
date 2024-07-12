import { useOutlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedOutlet = () => {
  const outlet = useOutlet();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedOutlet;